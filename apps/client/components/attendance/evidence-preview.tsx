'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, RotateCw } from 'lucide-react';
import type { ImageResponse } from '@dpm-core/api';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
	Paperclip,
	XIcon,
} from '@dpm-core/shared';

import { getImageUrlQueryOptions } from '@/remotes/queries/image';

interface EvidencePreviewProps extends ImageResponse {
	sequence: number;
}

export function EvidencePreview({ imageId, fileName, sequence }: EvidencePreviewProps) {
	const name = fileName?.trim() || `첨부 이미지 ${sequence}`;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button type="button" className="flex min-w-0 cursor-pointer items-center gap-1 text-left">
					<Paperclip className="shrink-0 text-label-assistive" />
					<span className="line-clamp-2 min-w-0 break-all">{name}</span>
				</button>
			</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-background-normal p-5"
			>
				<div className="flex items-center justify-between gap-3">
					<DialogTitle className="text-body1">첨부 자료</DialogTitle>
					<DialogClose asChild>
						<Button type="button" variant="text">
							<XIcon className="size-3" />
						</Button>
					</DialogClose>
				</div>
				<DialogDescription className="break-all">{name}</DialogDescription>
				<EvidenceImage imageId={imageId} fileName={name} />
			</DialogContent>
		</Dialog>
	);
}

interface EvidenceImageProps {
	imageId: number;
	fileName: string;
}

function EvidenceImage({ imageId, fileName }: EvidenceImageProps) {
	const { data: url, isFetching, isError, refetch } = useQuery(getImageUrlQueryOptions(imageId));

	return (
		<div className="relative h-[min(60dvh,480px)]">
			{isFetching ? (
				<ImageLoading />
			) : isError ? (
				<ImageError onRetry={() => refetch()} />
			) : url ? (
				<ImageContent key={url} url={url} fileName={fileName} onRetry={() => refetch()} />
			) : null}
		</div>
	);
}

interface ImageContentProps {
	url: string;
	fileName: string;
	onRetry: () => void;
}

function ImageContent({ url, fileName, onRetry }: ImageContentProps) {
	const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

	if (status === 'error') {
		return (
			<ImageError
				onRetry={() => {
					setStatus('loading');
					onRetry();
				}}
			/>
		);
	}

	return (
		<>
			<Image
				unoptimized
				fill
				src={url}
				alt={fileName}
				className={`object-contain ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
				onLoad={() => setStatus('loaded')}
				onError={() => setStatus('error')}
			/>
			{status === 'loading' && <ImageLoading />}
		</>
	);
}

function ImageLoading() {
	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<LoaderCircle className="size-5 animate-spin text-label-subtle" />
		</div>
	);
}

interface ImageErrorProps {
	onRetry: () => void;
}

function ImageError({ onRetry }: ImageErrorProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-3">
			<p className="text-body2 text-label-subtle">첨부 자료를 불러오지 못했어요.</p>
			<Button type="button" variant="assistive" size="sm" onClick={onRetry}>
				<RotateCw className="size-4" />
				다시 시도
			</Button>
		</div>
	);
}
