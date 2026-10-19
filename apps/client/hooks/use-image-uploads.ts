'use client';

import { useState } from 'react';
import { type ApiResponse, type ImageResponse, image } from '@dpm-core/api';

export type ImageUploadItem = {
	id: string;
	fileName: string;
} & ({ status: 'uploaded'; imageId: number } | { status: 'uploading' | 'error'; file: File });

export function useImageUploads(initialImages: ImageResponse[] = []) {
	const [items, setItems] = useState<ImageUploadItem[]>(() =>
		initialImages.map(({ imageId, fileName }, index) => ({
			id: `image-${imageId}`,
			fileName: fileName?.trim() || `첨부 이미지 ${index + 1}`,
			imageId,
			status: 'uploaded',
		})),
	);
	function replaceItem(item: ImageUploadItem) {
		setItems((items) => items.map((entry) => (entry.id === item.id ? item : entry)));
	}

	async function start(item: ImageUploadItem) {
		if (item.status === 'uploaded') return;
		const { id, fileName, file } = item;
		replaceItem({ id, fileName, file, status: 'uploading' });
		try {
			const imageId = await uploadImage(file);
			replaceItem({ id, fileName, imageId, status: 'uploaded' });
		} catch {
			replaceItem({ id, fileName, file, status: 'error' });
		}
	}

	function addFiles(files: File[]) {
		const added: ImageUploadItem[] = files.map((file) => ({
			id: crypto.randomUUID(),
			fileName: file.name,
			file,
			status: 'uploading',
		}));
		setItems((items) => [...items, ...added]);
		for (const item of added) start(item);
	}

	function remove(id: string) {
		setItems((items) => items.filter((item) => item.id !== id));
	}

	function retry(id: string) {
		const item = items.find((item) => item.id === id);
		if (item?.status === 'error') start(item);
	}

	const uploaded = items.filter((item) => item.status === 'uploaded');

	return {
		items,
		addFiles,
		remove,
		retry,
		imageIds: uploaded.map((item) => item.imageId),
		isReady: uploaded.length === items.length,
	};
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const EXPIRED_MESSAGE = '업로드 시간이 지났어요. 다시 시도해 주세요.';

async function uploadImage(file: File): Promise<number> {
	const contentType = file.type;
	if (contentType !== 'image/jpeg' && contentType !== 'image/png') {
		throw new Error('JPG 또는 PNG 이미지를 선택해 주세요.');
	}
	if (file.size > MAX_IMAGE_BYTES) {
		throw new Error('파일 크기가 10MB 이하인 이미지를 선택해 주세요.');
	}

	const { data } = await image.createUpload({ contentType, size: file.size });
	const expiresAt = Date.parse(data.expiresAt);
	if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
		throw new Error(EXPIRED_MESSAGE);
	}

	const uploaded = await fetch(data.uploadUrl, {
		method: 'PUT',
		body: file,
		headers: { 'Content-Type': contentType },
	});
	if (!uploaded.ok) throw new Error('파일을 올리지 못했어요. 다시 시도해 주세요.');

	while (Date.now() < expiresAt) {
		const response = await image.completeUpload(data.uploadId);
		if (response.status === 200) {
			const { data: completed } = (await response.json()) as ApiResponse<{ imageId: number }>;
			return completed.imageId;
		}

		if (![202, 429, 503].includes(response.status)) {
			throw new Error('이미지 업로드를 완료하지 못했어요. 다시 시도해 주세요.');
		}

		const retryAfter = Number(response.headers.get('Retry-After'));
		const seconds =
			Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : response.status === 202 ? 1 : 3;
		const delay = seconds * 1000;
		if (Date.now() + delay >= expiresAt) throw new Error(EXPIRED_MESSAGE);
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
	throw new Error(EXPIRED_MESSAGE);
}
