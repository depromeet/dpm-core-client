'use client';

import { useState } from 'react';
import { TeamTabBar } from '@dpm-core/shared';

import type { AssignmentDetailProps, Member } from '../../types';
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

	// 목업 데이터
	const members: Member[] = [
		{
			id: '1',
			name: '{디퍼 이름}',
			team: '{N}팀',
			role: '{디퍼 직무}',
			submitStatus: 'not-submitted',
		},
		{
			id: '2',
			name: '{디퍼 이름}',
			team: '{N}팀',
			role: '{디퍼 직무}',
			submitStatus: 'completed',
		},
		{
			id: '3',
			name: '{디퍼 이름}',
			team: '{N}팀',
			role: '{디퍼 직무}',
			submitStatus: 'late',
		},
		{
			id: '4',
			name: '{디퍼 이름}',
			team: '{N}팀',
			role: '{디퍼 직무}',
			submitStatus: 'pending',
		},
	];

	const handleSendReminder = () => {
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
