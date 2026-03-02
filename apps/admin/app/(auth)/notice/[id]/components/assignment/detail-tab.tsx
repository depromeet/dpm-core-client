'use client';

import type { NoticeTag } from '../../types';
import { NoticeContent } from '../common/notice-content';
import { ReadStatusSidebar } from '../common/read-status-sidebar';

interface AssignmentDetailTabProps {
	announcementId: number;
	title: string;
	date: string;
	readCount: number;
	content: string;
	tags: NoticeTag[];
	onSendReminder?: () => void;
}

export const AssignmentDetailTab = ({
	announcementId,
	title,
	date,
	readCount,
	content,
	tags,
	onSendReminder,
}: AssignmentDetailTabProps) => {
	return (
		<div className="flex flex-1 overflow-hidden">
			{/* 좌측: 과제 상세 */}
			<div className="flex flex-1 flex-col overflow-y-auto border-line-normal border-r p-10">
				<NoticeContent
					title={title}
					date={date}
					readCount={readCount}
					content={content}
					tags={tags}
				/>
			</div>

			{/* 우측: 조회 현황 */}
			<ReadStatusSidebar announcementId={announcementId} onSendReminder={onSendReminder} />
		</div>
	);
};
