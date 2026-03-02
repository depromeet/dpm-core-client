'use client';

import { NoticeTag as NoticeTagComponent } from '@/components/notice/notice-tag';

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
			{/* Title Section */}
			<div className="flex flex-col gap-4">
				<NoticeTagComponent type={firstTag} className="w-fit" />

				<div className="flex flex-col gap-2">
					<h2 className="font-semibold text-label-strong text-title1">{title}</h2>

					<div className="flex items-center gap-1 text-body2 text-label-assistive">
						<span>{date}</span>
						<div className="h-4 w-px bg-line-normal" />
						<span>{readCount}명 읽음</span>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="whitespace-pre-wrap font-medium text-body2 text-label-normal">{content}</div>
		</div>
	);
};
