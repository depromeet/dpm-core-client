'use client';

import type { NoticeTag } from '../../types';
import { NoticeContent } from '../common/notice-content';
import { ReadStatusSidebar } from '../common/read-status-sidebar';

interface Member {
	id: string;
	name: string;
	team: string;
	role: string;
	submitStatus?: string;
}

interface AssignmentDetailTabProps {
	title: string;
	date: string;
	readCount: number;
	content: string;
	tags: NoticeTag[];
	unreadMembers: Member[];
	readMembers: Member[];
	onSendReminder?: () => void;
}

export const AssignmentDetailTab = ({
	title,
	date,
	readCount,
	content,
	tags,
	unreadMembers,
	readMembers,
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
			<ReadStatusSidebar
				unreadMembers={unreadMembers}
				readMembers={readMembers}
				onSendReminder={onSendReminder}
			/>
		</div>
	);
};
