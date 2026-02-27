'use client';

import { useRouter } from 'next/navigation';
import { Suspense, use } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { Announcement, ApiResponse } from '@dpm-core/api';
import { type Profile, SidebarInset, toast } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { NoticeDetailHeader } from '@/components/notice/notice-detail-header';
import { formatISOStringToDate } from '@/lib/date';
import {
	getAnnouncementDetailQuery,
	getAnnouncementListQuery,
} from '@/remotes/queries/announcement';

import { AssignmentDetail } from './components/assignment/assignment-detail';
import { NoticeContent } from './components/common/notice-content';
import { ReadStatusSidebar } from './components/common/read-status-sidebar';

type NoticeTag = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

function getTagsFromAnnouncement(item?: Announcement): NoticeTag[] {
	if (item?.announcementType === 'ASSIGNMENT') {
		const tags: NoticeTag[] = ['assignment'];
		if (item.assignmentType === 'INDIVIDUAL') tags.push('individual');
		if (item.assignmentType === 'TEAM') tags.push('team');
		return tags;
	}
	return ['default'];
}

interface NoticeDetailContentProps {
	announcementId: number;
}

const NoticeDetailContent = ({ announcementId }: NoticeDetailContentProps) => {
	const router = useRouter();
	const {
		data: { data: detail },
	} = useSuspenseQuery(getAnnouncementDetailQuery(announcementId));

	const queryClient = useQueryClient();
	const listCache = queryClient.getQueryData(getAnnouncementListQuery.queryKey) as
		| ApiResponse<{ announcementCount: number; announcements: Announcement[] }>
		| undefined;
	const cachedAnnouncement = listCache?.data.announcements.find(
		(a) => a.announcementId === announcementId,
	);

	const isAssignment = cachedAnnouncement?.announcementType === 'ASSIGNMENT';
	const tags = getTagsFromAnnouncement(cachedAnnouncement);
	const formattedDate = formatISOStringToDate(detail.createdAt);
	const readProfiles: Profile[] = [];

	const handleBack = () => router.push('/notice');

	const handleEdit = () => {
		console.log('수정하기 클릭');
		// TODO: 공지 수정 페이지로 이동
	};

	const handleRemindSend = () => {
		// TODO: 리마인드 전송 API 호출
		toast.light('리마인드 알림이 전송되었어요.');
	};

	return (
		<div className="flex h-screen w-full flex-col bg-background-normal">
			<NoticeDetailHeader
				title="공지 상세"
				readProfiles={readProfiles}
				readCount={detail.markAsReadCount}
				onBack={handleBack}
				onEdit={handleEdit}
			/>

			{isAssignment ? (
				<AssignmentDetail
					announcementId={announcementId}
					title={detail.title}
					date={formattedDate}
					readCount={detail.markAsReadCount}
					content={detail.content}
					tags={tags}
				/>
			) : (
				<div className="flex flex-1 overflow-hidden">
					<div className="flex flex-1 flex-col overflow-y-auto border-line-normal border-r p-10">
						<NoticeContent
							title={detail.title}
							date={formattedDate}
							readCount={detail.markAsReadCount}
							content={detail.content}
							tags={tags}
						/>
					</div>

					<ReadStatusSidebar
						announcementId={announcementId}
						onSendReminder={handleRemindSend}
					/>
				</div>
			)}
		</div>
	);
};

interface NoticeDetailPageProps {
	params: Promise<{ id: string }>;
}

const NoticeDetailPage = ({ params: paramsPromise }: NoticeDetailPageProps) => {
	const params = use(paramsPromise);
	const announcementId = Number(params.id);

	return (
		<SidebarInset>
			<ErrorBoundary
				fallback={(props: ErrorBoundaryFallbackProps) => <ErrorBox onReset={() => props.reset()} />}
			>
				<Suspense
					fallback={
						<div className="flex h-screen w-full items-center justify-center">
							<LoadingBox />
						</div>
					}
				>
					<NoticeDetailContent announcementId={announcementId} />
				</Suspense>
			</ErrorBoundary>
		</SidebarInset>
	);
};

export default NoticeDetailPage;
