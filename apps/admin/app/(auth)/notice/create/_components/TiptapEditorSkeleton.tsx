'use client';

import { Skeleton } from '@dpm-core/shared';

/**
 * @description Tiptap 에디터 로딩 스켈레톤
 */
export const TiptapEditorSkeleton = () => {
	return (
		<div className="flex w-full flex-col">
			{/* 툴바 스켈레톤 */}
			<div className="w-full border-line-normal border-b">
				<div className="flex min-w-fit items-center gap-2.5 p-5">
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<div className="h-5 w-px bg-line-normal" />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<div className="h-5 w-px bg-line-normal" />
					<Skeleton className="h-8 w-8 rounded" />
					<div className="h-5 w-px bg-line-normal" />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
				</div>
			</div>
			{/* 에디터 영역 스켈레톤 */}
			<Skeleton className="min-h-[300px] w-full rounded-lg bg-background-normal" />
		</div>
	);
};
