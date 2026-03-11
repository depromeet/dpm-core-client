'use client';

import { Suspense, use } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { AnnouncementDetail } from '@dpm-core/api';
import { SidebarInset } from '@dpm-core/shared';

import type { NoticeSchema } from '@/app/(auth)/announcement/create/_schemas/notice-schema';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useNoticeForm } from '@/hooks/use-notice-form';
import { getAnnouncementDetailQuery } from '@/remotes/queries/announcement';

import { NoticeForm } from '../../_components/notice-form';

/** ISO date-time 문자열에서 HHMM 4자리 추출 */
function extractTimeHHMM(isoString?: string): string {
	if (!isoString) return '';
	const date = new Date(isoString);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${hours}${minutes}`;
}

/** 서버 응답을 폼 초기값으로 변환 */
function toFormDefaults(detail: AnnouncementDetail): Partial<NoticeSchema> {
	const isAssignment = detail.announcementType === 'ASSIGNMENT';

	const category: NoticeSchema['category'] = isAssignment
		? 'assignment'
		: detail.announcementType === 'NOTICE'
			? 'required'
			: 'other';

	const defaults: Partial<NoticeSchema> = {
		category,
		title: detail.title,
		content: detail.content,
		sendNotification: detail.shouldSendNotification ?? false,
		isScheduled: !!detail.scheduledAt,
	};

	if (detail.scheduledAt) {
		defaults.scheduledDate = new Date(detail.scheduledAt);
		defaults.scheduledTime = extractTimeHHMM(detail.scheduledAt);
	}

	if (isAssignment && detail.assignment) {
		defaults.assignmentType = detail.assignment.submitType === 'INDIVIDUAL' ? 'individual' : 'team';
		defaults.submissionLink = detail.assignment.submitLink ?? '';

		if (detail.assignment.startAt) {
			defaults.submissionStartDate = new Date(detail.assignment.startAt);
			defaults.submissionStartTime = extractTimeHHMM(detail.assignment.startAt);
		}
		if (detail.assignment.dueAt) {
			defaults.submissionEndDate = new Date(detail.assignment.dueAt);
			defaults.submissionEndTime = extractTimeHHMM(detail.assignment.dueAt);
		}
	}

	return defaults;
}

interface EditNoticeContentProps {
	announcementId: number;
}

const EditNoticeContent = ({ announcementId }: EditNoticeContentProps) => {
	const {
		data: { data: detail },
	} = useSuspenseQuery(getAnnouncementDetailQuery(announcementId));

	const defaultValues = toFormDefaults(detail);

	const { form, handleSubmit, isSubmitPending } = useNoticeForm({
		mode: 'edit',
		announcementId,
		defaultValues,
	});

	return (
		<NoticeForm
			mode="edit"
			form={form}
			onSubmit={handleSubmit}
			isSubmitPending={isSubmitPending}
		/>
	);
};

interface EditNoticePageProps {
	params: Promise<{ id: string }>;
}

const EditNoticePage = ({ params: paramsPromise }: EditNoticePageProps) => {
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
		<ErrorBoundary
			fallback={(props: ErrorBoundaryFallbackProps) => (
				<SidebarInset>
					<ErrorBox onReset={() => props.reset()} />
				</SidebarInset>
			)}
		>
			<Suspense
				fallback={
					<div className="flex h-screen w-full items-center justify-center">
						<LoadingBox />
					</div>
				}
			>
				<EditNoticeContent announcementId={announcementId} />
			</Suspense>
		</ErrorBoundary>
	);
};

export default EditNoticePage;
