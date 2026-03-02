'use client';

import { useState } from 'react';
import { TeamTabBar } from '@dpm-core/shared';

import type { AssignmentDetailProps, Member } from '../../types';
import { AssignmentDetailTab } from './detail-tab';
import { SubmissionStatusTab } from './submission-tab';

export const AssignmentDetail = ({
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

	// 읽은 디퍼 / 안 읽은 디퍼 목업 데이터
	const unreadMembers: Member[] = [
		{
			id: 'u1',
			name: '{안 읽은 디퍼} 이름',
			team: '{N}팀',
			role: '{디퍼} 직무',
			submitStatus: 'not-submitted',
		},
		{
			id: 'u2',
			name: '{안 읽은 디퍼} 이름',
			team: '{N}팀',
			role: '{디퍼} 직무',
			submitStatus: 'not-submitted',
		},
	];

	const readMembers: Member[] = [
		{
			id: 'r1',
			name: '{읽은 디퍼} 이름',
			team: '{N}팀',
			role: '{디퍼} 직무',
			submitStatus: 'completed',
		},
		{
			id: 'r2',
			name: '{읽은 디퍼} 이름',
			team: '{N}팀',
			role: '{디퍼} 직무',
			submitStatus: 'pending',
		},
		{
			id: 'r3',
			name: '{읽은 디퍼} 이름',
			team: '{N}팀',
			role: '{디퍼} 직무',
			submitStatus: 'late',
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
					title={title}
					date={date}
					readCount={readCount}
					content={content}
					tags={tags}
					unreadMembers={unreadMembers}
					readMembers={readMembers}
					onSendReminder={handleSendReminder}
				/>
			) : (
				<SubmissionStatusTab members={members} />
			)}
		</div>
	);
};
