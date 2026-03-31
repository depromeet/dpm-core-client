'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TeamTabBar } from '@dpm-core/shared';

import { getAnnouncementReadMembersQuery } from '@/remotes/queries/announcement';

import { type AssignmentDetailProps, type Member, toClientSubmitStatus } from '../../types';
import { AssignmentDetailTab } from './detail-tab';
import { SubmissionStatusTab } from './submission-tab';

export const AssignmentDetail = ({
	announcementId,
	title,
	date,
	readCount,
	content,
	tags,
}: AssignmentDetailProps) => {
	const [activeMainTab, setActiveMainTab] = useState<'detail' | 'status'>('detail');

	const {
		data: { data: readMembersData },
	} = useSuspenseQuery(getAnnouncementReadMembersQuery(announcementId));

	// readMembers + unreadMembers 합산으로 전체 멤버 목록 구성
	const members: Member[] = [
		...readMembersData.readMembers.map((m) => ({ ...m, isRead: true })),
		...readMembersData.unreadMembers.map((m) => ({ ...m, isRead: false })),
	].map(({ memberId, name, teamNumber, part, submitStatus, score, isRead, isAdmin }) => ({
		id: String(memberId),
		name,
		team: teamNumber === 0 ? '팀 미배정' : `${teamNumber}팀`,
		teamNumber,
		role: part,
		submitStatus: toClientSubmitStatus(submitStatus),
		isRead,
		isAdmin,
		score,
	}));

	const handleSendReminder = () => {
		// TODO: 리마인드 API 연동 필요
		console.log('리마인드 전송');
	};

	return (
		<div className="flex h-full flex-col overflow-hidden bg-background-normal">
			{/* 메인 탭 */}
			<div className="border-line-subtle border-b bg-background-normal px-10">
				<TeamTabBar
					tabs={[
						{ id: 'detail', label: '과제 상세' },
						{ id: 'status', label: '조회 및 제출 현황' },
					]}
					activeTabId={activeMainTab}
					onTabChange={(tabId) => setActiveMainTab(tabId as 'detail' | 'status')}
					className="border-b-0"
				/>
			</div>

			{/* 탭 내용 */}
			{activeMainTab === 'detail' ? (
				<AssignmentDetailTab
					announcementId={announcementId}
					title={title}
					date={date}
					readCount={readCount}
					content={content}
					tags={tags}
					onSendReminder={handleSendReminder}
				/>
			) : (
				<SubmissionStatusTab announcementId={announcementId} members={members} />
			)}
		</div>
	);
};
