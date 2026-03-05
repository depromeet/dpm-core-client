'use client';

import { Skeleton } from '@dpm-core/shared';

import { VerticalDivider } from './toolbars';

/**
 * @description Tiptap 에디터 로딩 스켈레톤
 */
export const TiptapEditorSkeleton = () => {
	return (
		<div className="flex w-full flex-col overflow-hidden rounded-lg border border-line-normal">
			{/* 툴바 스켈레톤 */}
			<div className="flex h-11 w-full items-center overflow-x-auto bg-background-subtle">
				<div className="flex min-w-fit items-center gap-2.5 px-5">
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<VerticalDivider />
					<Skeleton className="h-8 w-8 rounded" />
					<VerticalDivider />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<div className="ml-auto" />
					<VerticalDivider />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
				</div>
			</div>
			{/* 에디터 영역 스켈레톤 */}
			<Skeleton className="min-h-[300px] w-full bg-background-normal" />
		</div>
	);
};
