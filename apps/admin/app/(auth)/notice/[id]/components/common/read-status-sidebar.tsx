'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Button, MemberProfile, ReminderCallout, TeamTabBar } from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance/EmptyView';
import { getAnnouncementReadMembersQuery } from '@/remotes/queries/announcement';

interface ReadStatusSidebarProps {
	announcementId: number;
	onSendReminder?: () => void;
}

export const ReadStatusSidebar = ({ announcementId, onSendReminder }: ReadStatusSidebarProps) => {
	const [activeReadTab, setActiveReadTab] = useState<'unread' | 'read'>('unread');

	const {
		data: { data },
	} = useSuspenseQuery(getAnnouncementReadMembersQuery(announcementId));

	const currentMembers = activeReadTab === 'unread' ? data.unreadMembers : data.readMembers;

	return (
		<div className="flex h-full w-100 flex-col bg-background-normal">
			{/* Tab */}
			<TeamTabBar
				tabs={[
					{ id: 'unread', label: '안 읽은 디퍼' },
					{ id: 'read', label: '읽은 디퍼' },
				]}
				activeTabId={activeReadTab}
				onTabChange={(tabId) => setActiveReadTab(tabId as 'unread' | 'read')}
				className="w-full px-4 pt-3"
			/>

			{/* Member List */}
			<div className="flex-1 overflow-y-auto bg-background-normal p-5">
				{currentMembers.length > 0 ? (
					<div className="flex flex-col gap-2">
						{currentMembers.map(({ memberId, name, teamId, part }) => (
							<MemberProfile
								key={memberId}
								name={name}
								team={`${teamId}팀`}
								role={part}
								showHover
							/>
						))}
					</div>
				) : (
					<EmptyView message="모든 디퍼가 확인했어요!" />
				)}
			</div>

			{/* Footer */}
			<div className="border-line-normal border-t bg-background-normal p-5">
				<div className="flex flex-col gap-4">
					<ReminderCallout
						title="리마인드 알림 일괄 전송"
						description={`안읽은 디퍼들에게 푸시 알림이 전송돼요.\n알림은 24시간 내 한 번만 보낼 수 있어요.`}
					/>
					<Button size="lg" className="w-full" onClick={onSendReminder}>
						리마인드 전송
					</Button>
				</div>
			</div>
		</div>
	);
};
