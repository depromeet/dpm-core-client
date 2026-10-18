'use client';

import { Suspense } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useQueryErrorResetBoundary, useSuspenseQueries } from '@tanstack/react-query';
import { Sheet, SheetContent } from '@dpm-core/shared';

import { EvidencePreview } from '@/components/attendance';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useAttendanceStatusEdit } from '@/hooks';
import {
	getAbsenceReasonsOptions,
	getAttendanceBySessionDetailOptions,
} from '@/remotes/queries/attendance';

import { AttendanceDetailHeader } from '../../../_components/attendance-detail-header';
import { AttendanceStatusSection } from '../../../_components/attendance-status-section';
import { ProfileSection } from '../../../_components/profile-section';
import { SessionInfoSection } from '../../../_components/session-info-section';

interface AttendanceSessionDetailDrawerProps {
	memberId: number;
	sessionId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
interface AttendanceSessionDetailContentProps {
	memberId: number;
	sessionId: number;
}

function AttendanceSessionDetailContent({
	memberId,
	sessionId,
}: AttendanceSessionDetailContentProps) {
	const [detailQuery, reasonsQuery] = useSuspenseQueries({
		queries: [
			getAttendanceBySessionDetailOptions({ memberId, sessionId }),
			getAbsenceReasonsOptions({ sessionId }),
		],
	});
	const data = detailQuery.data.data;
	const reasons = reasonsQuery.data.data;
	const reason = reasons.reasons.find((item) => item.memberId === memberId);

	const {
		isEditMode,
		selectedStatus,
		setSelectedStatus,
		handleEdit,
		handleSave,
		handleCancel,
		isLoading,
	} = useAttendanceStatusEdit({ sessionId, memberId, initialStatus: data.attendance.status });

	return (
		<div className="flex-1 overflow-y-auto px-10 py-6">
			<ProfileSection
				name={data.member.name}
				part={data.member.part}
				teamNumber={data.member.teamNumber}
				isAdmin={data.member.isAdmin}
			/>
			<AttendanceStatusSection
				isEditMode={isEditMode}
				selectedStatus={selectedStatus}
				originalStatus={data.attendance.status}
				attendedAt={data.attendance.attendedAt}
				updatedAt={data.attendance.updatedAt}
				onStatusChange={setSelectedStatus}
				onSave={handleSave}
				onCancel={handleCancel}
				onEdit={handleEdit}
				isSaveDisabled={isLoading || selectedStatus === data.attendance.status}
				isSaving={isLoading}
				absenceReason={reason?.contents ?? null}
			/>
			{reason && reason.images.length > 0 ? (
				<section className="mb-6">
					<h3 className="mb-3 font-semibold text-body1">첨부 자료</h3>
					<ul className="flex flex-wrap gap-2">
						{reason.images.map((image, index) => (
							<li
								key={image.imageId}
								className="max-w-full rounded-md bg-background-subtle px-3 py-2 text-caption1"
							>
								<EvidencePreview
									imageId={image.imageId}
									fileName={image.fileName}
									sequence={index + 1}
								/>
							</li>
						))}
					</ul>
				</section>
			) : null}
			<SessionInfoSection
				week={data.session.week}
				eventName={data.session.eventName}
				date={data.session.date}
			/>
		</div>
	);
}

export function AttendanceSessionDetailDrawer({
	memberId,
	sessionId,
	open,
	onOpenChange,
}: AttendanceSessionDetailDrawerProps) {
	const { reset } = useQueryErrorResetBoundary();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full max-w-150! gap-0 border-none p-0">
				<AttendanceDetailHeader title="출석 상세" />
				<ErrorBoundary
					onReset={reset}
					fallback={({ reset: resetError }: ErrorBoundaryFallbackProps) => (
						<ErrorBox onReset={resetError} />
					)}
				>
					<Suspense fallback={<LoadingBox />}>
						<AttendanceSessionDetailContent memberId={memberId} sessionId={sessionId} />
					</Suspense>
				</ErrorBoundary>
			</SheetContent>
		</Sheet>
	);
}
