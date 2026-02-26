'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { Announcement } from '@dpm-core/api';
import { Button, Plus, SidebarInset, TeamTabBar } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { NoticeCard } from '@/components/notice/notice-card';
import { NoticeHeader } from '@/components/notice/notice-header';
import { formatISOStringToDate } from '@/lib/date';
import { getAnnouncementListQuery } from '@/remotes/queries/announcement';

type NoticeType = 'all' | 'general' | 'assignment' | 'etc';
type NoticeTag = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

function getTagsFromAnnouncement(item: Announcement): NoticeTag[] {
	if (item.announcementType === 'ASSIGNMENT') {
		const tags: NoticeTag[] = ['assignment'];
		if (item.assignmentType === 'INDIVIDUAL') tags.push('individual');
		if (item.assignmentType === 'TEAM') tags.push('team');
		return tags;
	}
	return ['default'];
}

function filterByType(item: Announcement, selectedType: NoticeType): boolean {
	if (selectedType === 'all') return true;
	if (selectedType === 'general') return item.announcementType === 'NOTICE';
	if (selectedType === 'assignment') return item.announcementType === 'ASSIGNMENT';
	return false;
}

interface NoticeListContainerProps {
	selectedType: NoticeType;
	onTabChange: (tab: NoticeType) => void;
}

const NoticeListContainer = ({ selectedType, onTabChange }: NoticeListContainerProps) => {
	const router = useRouter();
	const {
		data: { data: announcementResponse },
	} = useSuspenseQuery(getAnnouncementListQuery);

	const filteredAnnouncements = announcementResponse.announcements.filter((item) =>
		filterByType(item, selectedType),
	);

	const handleNoticeClick = (announcementId: number) =>
		router.push(`/notice/${announcementId}`);

	return (
		<>
			{/* Title + Button */}
			<div className="flex w-full items-center justify-between px-10 pt-6">
				<div className="flex items-center gap-2">
					<h2 className="font-bold text-label-normal text-title1">공지 목록</h2>
					<span className="font-medium text-body1 text-primary-normal">
						{filteredAnnouncements.length}
					</span>
				</div>
				<Button
					size="lg"
					className="h-12 gap-1.5 rounded-lg bg-background-inverse px-5 py-3"
					onClick={() => console.log('공지 등록 클릭')}
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
				onTabChange={(tabId) => onTabChange(tabId as NoticeType)}
				className="w-full px-10"
			/>

			{/* Notice Card List */}
			<div className="flex w-full flex-col gap-3 px-10 py-6">
				{filteredAnnouncements.map((item) => (
					<NoticeCard
						key={item.announcementId}
						title={item.title}
						date={formatISOStringToDate(item.createdAt)}
						readCount={item.readMemberCount}
						tags={getTagsFromAnnouncement(item)}
						onClick={() => handleNoticeClick(item.announcementId)}
					/>
				))}
			</div>

			{/* Empty State */}
			{filteredAnnouncements.length === 0 && (
				<div className="flex min-h-100 w-full items-center justify-center">
					<p className="text-body1 text-label-alternative">등록된 공지가 없습니다.</p>
				</div>
			)}
		</>
	);
};

const NoticePage = () => {
	const [selectedType, setSelectedType] = useState<NoticeType>('all');

	return (
		<SidebarInset>
			<div className="flex h-screen max-w-full flex-col items-center">
				<NoticeHeader title="공지" className="w-full" />

				<div className="flex w-full flex-1 flex-col items-start bg-background-normal">
					<ErrorBoundary fallback={(props: ErrorBoundaryFallbackProps) => <ErrorBox onReset={() => props.reset()} />}>
						<Suspense
							fallback={
								<div className="flex w-full flex-1 items-center justify-center">
									<LoadingBox />
								</div>
							}
						>
							<NoticeListContainer
								selectedType={selectedType}
								onTabChange={setSelectedType}
							/>
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</SidebarInset>
	);
};

export default NoticePage;
