'use client';

import { NoticeInfo } from '@dpm-core/shared';

import type { NoticeTag } from '../../types';

interface NoticeContentProps {
	title: string;
	date: string;
	readCount: number;
	content: string;
	tags: NoticeTag[];
}

export const NoticeContent = ({ title, date, readCount, content, tags }: NoticeContentProps) => {
	const [firstTag] = tags;

	return (
		<div className="flex flex-col gap-10">
			<NoticeInfo
				title={title}
				date={date}
				readCount={readCount}
				tags={firstTag ? [firstTag] : []}
				className="gap-4"
				titleClassName="text-title1 text-label-strong"
				captionClassName="text-body2"
				dividerClassName="h-4 bg-line-normal"
			/>

			{/* Content Section */}
			<div
				className="ProseMirror font-medium text-body2 text-label-normal"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</div>
	);
};
