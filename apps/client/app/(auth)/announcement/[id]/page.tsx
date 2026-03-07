'use client';

import { Suspense, use, useState } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { type AnnouncementDetail, announcement } from '@dpm-core/api';
import { AppLayout, NoticeInfo } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToDotDate, formatISOStringToKoreanDate } from '@/lib/date';
import { getAnnouncementDetailQuery } from '@/remotes/queries/announcement';

import { AssignmentInfoCard } from './components/assignment-info-card';
import { ReadButton } from './components/read-button';

type NoticeTagType = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

function getTagsFromAnnouncement(detail: AnnouncementDetail): NoticeTagType[] {
	if (detail.announcementType === 'ASSIGNMENT') {
		const tags: NoticeTagType[] = ['assignment'];
		if (detail.assignment?.submitType === 'INDIVIDUAL') tags.push('individual');
		if (detail.assignment?.submitType === 'TEAM') tags.push('team');
		return tags;
	}
	if (detail.announcementType === 'NOTICE') return ['default'];
	return ['etc'];
}

interface NoticeDetailContentProps {
	announcementId: number;
}

const NoticeDetailContent = ({ announcementId }: NoticeDetailContentProps) => {
	const queryClient = useQueryClient();
	const {
		data: { data: detail },
	} = useSuspenseQuery(getAnnouncementDetailQuery(announcementId));

	const [isRead, setIsRead] = useState(detail.isRead);
	const [showTooltip, setShowTooltip] = useState(!detail.isRead);

	const { mutate: markAsRead } = useMutation({
		mutationFn: () => announcement.markAsRead(announcementId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['announcement-detail', announcementId] });
		},
	});

	const handleReadClick = () => {
		if (isRead) return;
		setIsRead(true);
		setShowTooltip(false);
		markAsRead();
	};

	const isAssignment = detail.announcementType === 'ASSIGNMENT';
	const tags = getTagsFromAnnouncement(detail);
	const formattedDate = formatISOStringToDotDate(detail.createdAt);
	const formattedDueAt = detail.assignment?.dueAt ? formatISOStringToKoreanDate(detail.assignment.dueAt) : undefined;

	return (
		<div className="flex flex-1 flex-col gap-5 p-4">
			<NoticeInfo
				title={detail.title}
				date={formattedDate}
				readCount={detail.markAsReadCount}
				tags={tags}
			/>

			<div className="h-px w-full bg-line-normal" />

			{isAssignment && (
				<AssignmentInfoCard
					dueAt={formattedDueAt}
					assignmentType={detail.assignment?.submitType ?? null}
					submitLink={detail.assignment?.submitLink}
				/>
			)}

			<div
				className="ProseMirror font-medium text-body2 text-label-normal"
				dangerouslySetInnerHTML={{ __html: detail.content }}
			/>

			<ReadButton
				readCount={detail.markAsReadCount}
				isRead={isRead}
				showTooltip={showTooltip}
				onClick={handleReadClick}
			/>
		</div>
	);
};

interface NoticeDetailPageProps {
	params: Promise<{ id: string }>;
}

const NoticeDetailPage = ({ params: paramsPromise }: NoticeDetailPageProps) => {
	const params = use(paramsPromise);
	const announcementId = Number(params.id);

	if (Number.isNaN(announcementId)) {
		return (
			<AppLayout className="bg-background-normal">
				<AppHeader title="공지 상세" className="mb-0" />
				<ErrorBox onReset={() => {}} />
			</AppLayout>
		);
	}

	return (
		<AppLayout className="bg-background-normal">
			<AppHeader title="공지 상세" className="mb-0" />
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
					<div className="flex flex-1 overflow-y-auto">
						<NoticeDetailContent announcementId={announcementId} />
					</div>
				</Suspense>
			</ErrorBoundary>
		</AppLayout>
	);
};

export default NoticeDetailPage;
