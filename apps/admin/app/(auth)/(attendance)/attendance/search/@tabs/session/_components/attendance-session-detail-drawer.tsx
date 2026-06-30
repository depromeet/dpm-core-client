'use client';

import { Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Sheet, SheetContent } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useAttendanceStatusEdit } from '@/hooks/use-attendance-status-edit';
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

const _AttendanceSessionDetailContent = ({
	memberId,
	sessionId,
}: {
	memberId: number;
	sessionId: number;
}) => {
	const { data: sessionDetail } = useSuspenseQuery(
		getAttendanceBySessionDetailOptions({ memberId, sessionId }),
	);
	const { data: absenceReasonsData } = useQuery({
		...getAbsenceReasonsOptions({ sessionId }),
		enabled: !!sessionId,
	});

	const { data } = sessionDetail;
	const absenceReason =
		absenceReasonsData?.data.reasons.find((r) => r.memberId === memberId)?.contents ?? null;

	const { isEditMode, selectedStatus, setSelectedStatus, setIsEditMode, handleSave, handleCancel } =
		useAttendanceStatusEdit({
			sessionId,
			memberId,
			initialStatus: data.attendance.status,
		});

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
				onEdit={() => setIsEditMode(true)}
				isSaveDisabled={selectedStatus === data.attendance.status}
				absenceReason={absenceReason}
			/>

			<SessionInfoSection
				week={data.session.week}
				eventName={data.session.eventName}
				date={data.session.date}
			/>
		</div>
	);
};

export const AttendanceSessionDetailDrawer = ({
	memberId,
	sessionId,
	open,
	onOpenChange,
}: AttendanceSessionDetailDrawerProps) => {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full gap-0 border-none p-0 sm:max-w-150">
				<AttendanceDetailHeader title="출석 상세" />
				<ErrorBoundary
					fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
				>
					<Suspense fallback={<LoadingBox />}>
						<_AttendanceSessionDetailContent memberId={memberId} sessionId={sessionId} />
					</Suspense>
				</ErrorBoundary>
			</SheetContent>
		</Sheet>
	);
};
