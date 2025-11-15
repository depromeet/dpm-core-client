'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Sheet, SheetContent } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useAttendanceStatusEdit } from '@/hooks/use-attendance-status-edit';
import { getAttendanceBySessionDetailOptions } from '@/remotes/queries/attendance';

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
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceBySessionDetailOptions({ memberId, sessionId }));

	const { isEditMode, selectedStatus, setSelectedStatus, setIsEditMode, handleSave, handleCancel } =
		useAttendanceStatusEdit({
			sessionId,
			memberId,
			initialStatus: data.attendance.status,
		});

	return (
		<div className="flex-1 overflow-y-auto px-6 py-6">
			<ProfileSection
				name={data.member.name}
				part={data.member.part}
				teamNumber={data.member.teamNumber}
			/>

			<AttendanceStatusSection
				isEditMode={isEditMode}
				selectedStatus={selectedStatus}
				originalStatus={data.attendance.status}
				attendedAt={data.attendance.attendedAt}
				onStatusChange={setSelectedStatus}
				onSave={handleSave}
				onCancel={handleCancel}
				onEdit={() => setIsEditMode(true)}
				isSaveDisabled={selectedStatus === data.attendance.status}
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
			<SheetContent side="right" className="w-full border-none p-0 sm:max-w-[600px]">
				<AttendanceDetailHeader title="출석 상세" />
				<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
					<Suspense fallback={<LoadingBox />}>
						<_AttendanceSessionDetailContent memberId={memberId} sessionId={sessionId} />
					</Suspense>
				</ErrorBoundary>
			</SheetContent>
		</Sheet>
	);
};
