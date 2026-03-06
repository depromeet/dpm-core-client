'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { Announcement } from '@dpm-core/api';
import { AppLayout, TeamTabBar } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { BottomTabBar } from '@/components/bottom-tab-bar';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { NoticeCard } from '@/components/notice/notice-card';
import { formatISOStringToDotDate } from '@/lib/date';
import { getAnnouncementListQuery } from '@/remotes/queries/announcement';

type NoticeType = 'all' | 'general' | 'assignment' | 'etc';
type NoticeTag = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

const NOTICE_TABS = [
	{ id: 'all', label: '전체' },
	{ id: 'general', label: '일반' },
	{ id: 'assignment', label: '과제' },
	{ id: 'etc', label: '기타' },
] as const;

function getTagsFromAnnouncement(item: Announcement): NoticeTag[] {
	if (item.announcementType === 'ASSIGNMENT') {
		const tags: NoticeTag[] = ['assignment'];
		if (item.assignmentType === 'INDIVIDUAL') tags.push('individual');
		if (item.assignmentType === 'TEAM') tags.push('team');
		return tags;
	}
	if (item.announcementType === 'NOTICE') return ['default'];
	return ['etc'];
}

function filterByType(item: Announcement, selectedType: NoticeType): boolean {
	if (selectedType === 'all') return true;
	if (selectedType === 'general') return item.announcementType === 'NOTICE';
	if (selectedType === 'assignment') return item.announcementType === 'ASSIGNMENT';
	if (selectedType === 'etc')
		return item.announcementType !== 'NOTICE' && item.announcementType !== 'ASSIGNMENT';
	return false;
}

interface NoticeListContainerProps {
	selectedType: NoticeType;
}

const NoticeListContainer = ({ selectedType }: NoticeListContainerProps) => {
	const router = useRouter();
	const {
		data: { data: announcementResponse },
	} = useSuspenseQuery(getAnnouncementListQuery);

	const filteredAnnouncements = announcementResponse.announcements.filter((item: Announcement) =>
		filterByType(item, selectedType),
	);

	const handleNoticeClick = (announcementId: number) =>
		router.push(`/announcement/${announcementId}`);

	if (filteredAnnouncements.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center py-20">
				<p className="text-body1 text-label-alternative">등록된 공지가 없습니다.</p>
			</div>
		);
	}

	return (
		<div className="scrollbar-hide flex w-full flex-1 flex-col overflow-y-auto px-4 py-5">
			{filteredAnnouncements.map((item: Announcement, index: number) => (
				<div key={item.announcementId}>
					<NoticeCard
						title={item.title}
						date={formatISOStringToDotDate(item.createdAt)}
						readCount={item.readMemberCount}
						tags={getTagsFromAnnouncement(item)}
						onClick={() => handleNoticeClick(item.announcementId)}
					/>
					{index < filteredAnnouncements.length - 1 && (
						<div className="my-5 h-px w-full bg-line-normal" />
					)}
				</div>
			))}
		</div>
	);
};

const NoticePage = () => {
	const [selectedType, setSelectedType] = useState<NoticeType>('all');

	return (
		<AppLayout className="h-dvh bg-background-normal">
			<AppHeader title="공지" className="mb-0 py-0" />

			<TeamTabBar
				tabs={[...NOTICE_TABS]}
				activeTabId={selectedType}
				onTabChange={(tabId) => setSelectedType(tabId as NoticeType)}
				className="w-full px-4 pt-1"
			/>

			<ErrorBoundary
				fallback={(props: ErrorBoundaryFallbackProps) => <ErrorBox onReset={() => props.reset()} />}
			>
				<Suspense
					fallback={
						<div className="flex flex-1 items-center justify-center">
							<LoadingBox />
						</div>
					}
				>
					<NoticeListContainer selectedType={selectedType} />
				</Suspense>
			</ErrorBoundary>
			<BottomTabBar />
		</AppLayout>
	);
};

export default NoticePage;
