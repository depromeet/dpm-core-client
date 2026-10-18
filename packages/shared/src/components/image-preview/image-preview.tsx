'use client';

import { useState } from 'react';
import { LoaderCircle, RotateCw } from 'lucide-react';

import { Button } from '../ui/button';

interface ImagePreviewProps {
	url: string | undefined;
	fileName: string;
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
}

export function ImagePreview({ url, fileName, isLoading, isError, onRetry }: ImagePreviewProps) {
	return (
		<div className="relative h-[min(60dvh,480px)]">
			{isLoading ? (
				<ImageLoading />
			) : isError ? (
				<ImageError onRetry={onRetry} />
			) : url ? (
				<ImageContent key={url} url={url} fileName={fileName} onRetry={onRetry} />
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
	if (status === 'error')
		return (
			<ImageError
				onRetry={() => {
					setStatus('loading');
					onRetry();
				}}
			/>
		);
	return (
		<>
			<img
				src={url}
				alt={fileName}
				loading="lazy"
				decoding="async"
				className={`absolute inset-0 size-full object-contain ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
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
