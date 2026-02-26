'use client';

import { useState } from 'react';
import { Button, MemberProfile, ReminderCallout, TeamTabBar } from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance/EmptyView';

interface Member {
	id: string;
	name: string;
	team: string;
	role: string;
	submitStatus?: string;
}

interface ReadStatusSidebarProps {
	unreadMembers: Member[];
	readMembers: Member[];
	onSendReminder?: () => void;
}

export const ReadStatusSidebar = ({
	unreadMembers,
	readMembers,
	onSendReminder,
}: ReadStatusSidebarProps) => {
	const [activeReadTab, setActiveReadTab] = useState<'unread' | 'read'>('unread');

	const currentReadMembers = activeReadTab === 'unread' ? unreadMembers : readMembers;

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
				{currentReadMembers.length > 0 ? (
					<div className="flex flex-col gap-2">
						{currentReadMembers.map(({ id, name, team, role }) => (
							<MemberProfile key={id} name={name} team={team} role={role} showHover />
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
