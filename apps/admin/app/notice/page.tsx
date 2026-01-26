'use client';

import { useState } from 'react';
import { Button, Plus, SidebarInset, TeamTabBar } from '@dpm-core/shared';

import { NoticeCard } from '@/components/notice/notice-card';
import { NoticeHeader } from '@/components/notice/notice-header';

type NoticeType = 'all' | 'general' | 'assignment' | 'etc';

interface Notice {
	id: string;
	title: string;
	date: string;
	readCount: number;
	tags: Array<'default' | 'assignment' | 'individual' | 'team' | 'etc'>;
}

const NoticePage = () => {
	const [selectedType, setSelectedType] = useState<NoticeType>('all');

	// 목업 데이터
	const notices: Notice[] = [
		{
			id: '1',
			title:
				'{공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다.}',
			date: '(YYYY.MM.DD)',
			readCount: 0,
			tags: ['default'],
		},
		{
			id: '2',
			title:
				'{공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다.}',
			date: '(YYYY.MM.DD)',
			readCount: 0,
			tags: ['assignment', 'individual'],
		},
		{
			id: '3',
			title:
				'{공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다.}',
			date: '(YYYY.MM.DD)',
			readCount: 0,
			tags: ['assignment', 'team'],
		},
		{
			id: '4',
			title:
				'{공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다.}',
			date: '(YYYY.MM.DD)',
			readCount: 0,
			tags: ['default'],
		},
		{
			id: '5',
			title:
				'{공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다. 공지 제목이 들어갑니다.}',
			date: '(YYYY.MM.DD)',
			readCount: 0,
			tags: ['assignment', 'team'],
		},
	];

	// 선택된 타입에 따라 필터링
	const filteredNotices = notices.filter((notice) => {
		if (selectedType === 'all') return true;
		if (selectedType === 'general') return notice.tags.includes('default');
		if (selectedType === 'assignment') return notice.tags.includes('assignment');
		if (selectedType === 'etc') return notice.tags.includes('etc');
		return true;
	});

	const handleNoticeClick = (noticeId: string) => {
		console.log('공지 클릭:', noticeId);
		// TODO: 공지 상세 페이지로 이동
	};

	const handleCreateNotice = () => {
		console.log('공지 등록 클릭');
		// TODO: 공지 등록 페이지로 이동
	};

	return (
		<SidebarInset>
			<div className="flex h-screen max-w-full flex-col items-center">
				{/* Header */}
				<NoticeHeader title="공지" className="w-full" />

				{/* Body */}
				<div className="flex w-full flex-1 flex-col items-start bg-background-normal">
					{/* Title + Button */}
					<div className="flex w-full items-center justify-between px-10 pt-6">
						<div className="flex items-center gap-2">
							<h2 className="font-bold text-label-normal text-title1">공지 목록</h2>
							<span className="font-medium text-body1 text-primary-normal">
								{filteredNotices.length}
							</span>
						</div>
						<Button
							size="lg"
							className="h-12 gap-1.5 rounded-lg bg-background-inverse px-5 py-3"
							onClick={handleCreateNotice}
						>
							<Plus className="size-5 text-icon-noraml" />
							공지 등록
						</Button>
					</div>

					{/* Tab Bar */}
					<TeamTabBar
						tabs={[
							{ id: 'all', label: '전체' },
							{ id: 'general', label: '일반' },
							{ id: 'assignment', label: '과제' },
							{ id: 'etc', label: '기타' },
						]}
						activeTabId={selectedType}
						onTabChange={(tabId) => setSelectedType(tabId as NoticeType)}
						className="w-full px-10"
					/>

					{/* Notice Card List */}
					<div className="flex w-full flex-col gap-3 px-10 py-6">
						{filteredNotices.map(({ id, title, date, readCount, tags }) => (
							<NoticeCard
								key={id}
								title={title}
								date={date}
								readCount={readCount}
								tags={tags}
								onClick={() => handleNoticeClick(id)}
							/>
						))}
					</div>

					{/* Empty State */}
					{filteredNotices.length === 0 && (
						<div className="flex min-h-100 w-full items-center justify-center">
							<p className="text-body1 text-label-alternative">등록된 공지가 없습니다.</p>
						</div>
					)}
				</div>
			</div>
		</SidebarInset>
	);
};

export default NoticePage;
