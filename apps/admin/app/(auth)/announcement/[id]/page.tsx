'use client';

import { useRouter } from 'next/navigation';
import { Suspense, use, useState } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { AnnouncementDetail } from '@dpm-core/api';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	type Profile,
	SidebarInset,
	toast,
} from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { NoticeDetailHeader } from '@/components/notice/notice-detail-header';
import { formatISOStringToDate } from '@/lib/date';
import { deleteAnnouncementMutationOptions } from '@/remotes/mutations/announcement';
import {
	getAnnouncementDetailQuery,
	getAnnouncementReadMembersQuery,
} from '@/remotes/queries/announcement';

import { AssignmentDetail } from './components/assignment/assignment-detail';
import { NoticeContent } from './components/common/notice-content';
import { ReadStatusSidebar } from './components/common/read-status-sidebar';

type NoticeTag = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

function getTagsFromAnnouncement(item?: AnnouncementDetail): NoticeTag[] {
	if (item?.announcementType === 'ASSIGNMENT') {
		const tags: NoticeTag[] = ['assignment'];
		if (item.assignment?.submitType === 'INDIVIDUAL') tags.push('individual');
		if (item.assignment?.submitType === 'TEAM') tags.push('team');
		return tags;
	}
	return ['default'];
}

interface NoticeDetailContentProps {
	announcementId: number;
}

const NoticeDetailContent = ({ announcementId }: NoticeDetailContentProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const {
		data: { data: detail },
	} = useSuspenseQuery(getAnnouncementDetailQuery(announcementId));

	const {
		data: { data: readMembersData },
	} = useSuspenseQuery(getAnnouncementReadMembersQuery(announcementId));

	const { mutate: deleteAnnouncement } = useMutation(
		deleteAnnouncementMutationOptions(announcementId, {
			onSuccess: () => {
				toast.success('공지가 삭제되었습니다.');
				queryClient.invalidateQueries({ queryKey: ['announcement-list'] });
				router.replace('/announcement');
			},
			onError: () => {
				toast.error('공지 삭제에 실패하였습니다.');
			},
		}),
	);

	const isAssignment = detail.announcementType === 'ASSIGNMENT';
	const tags = getTagsFromAnnouncement(detail);
	const formattedDate = formatISOStringToDate(detail.createdAt);
	const readProfiles: Profile[] = readMembersData.readMembers.map(({ memberId, name }) => ({
		id: String(memberId),
		name,
	}));

	const handleBack = () => router.push('/announcement');

	const handleEdit = () => {
		router.push(`/announcement/${announcementId}/edit`);
	};

	const handleDelete = () => {
		setDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		setDeleteModalOpen(false);
		deleteAnnouncement();
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
				onDelete={handleDelete}
			/>

			<Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
				<DialogContent className="gap-8 sm:max-w-160" showCloseButton={false}>
					<DialogHeader className="gap-6 text-left">
						<DialogTitle className="text-[22px]">공지 삭제</DialogTitle>
						<DialogDescription>
							해당 공지를 삭제할까요? 삭제한 공지는 다시 복구할 수 없어요.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive" size="lg" className="flex-1">
								취소
							</Button>
						</DialogClose>
						<Button
							size="lg"
							className="flex-1 bg-red-500 text-white hover:bg-red-600"
							onClick={handleConfirmDelete}
						>
							삭제하기
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

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

					<ReadStatusSidebar announcementId={announcementId} onSendReminder={handleRemindSend} />
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

	if (Number.isNaN(announcementId)) {
		return (
			<SidebarInset>
				<ErrorBox onReset={() => {}} />
			</SidebarInset>
		);
	}

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
