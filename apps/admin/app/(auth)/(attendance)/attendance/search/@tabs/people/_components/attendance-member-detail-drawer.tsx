'use client';

import { Suspense, useState } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { AttendanceSession } from '@dpm-core/api';
import {
	Badge,
	Button,
	Calender,
	Clock,
	formatDotFullDate,
	formatTimeOnly,
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	XCircle,
} from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { Profile } from '@/components/attendance/profile';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useAttendanceStatusEdit } from '@/hooks/use-attendance-status-edit';
import { getAttendanceMemberStatusLabel } from '@/lib/attendance/status';
import {
	getAttendanceByMemberDetailOptions,
	getAttendanceBySessionDetailOptions,
} from '@/remotes/queries/attendance';

import { AttendanceDetailHeader } from '../../../_components/attendance-detail-header';
import { AttendanceStatusSection } from '../../../_components/attendance-status-section';
import { ProfileSection } from '../../../_components/profile-section';
import { SessionInfoSection } from '../../../_components/session-info-section';

interface AttendanceMemberDetailDrawerProps {
	memberId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const _AttendanceMemberHeader = ({ memberId }: { memberId: number }) => {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceByMemberDetailOptions({ memberId }));

	return (
		<div className="mb-4 flex items-center justify-between">
			<Profile
				size={60}
				name={data.member.name}
				part={data.member.part}
				teamNumber={data.member.teamNumber}
			/>
			{data.member.attendanceStatus !== 'NORMAL' && (
				<Badge variant={data.member.attendanceStatus}>
					{getAttendanceMemberStatusLabel(data.member.attendanceStatus)}
				</Badge>
			)}
		</div>
	);
};

const _AttendanceMemberDetailContent = ({ memberId }: { memberId: number }) => {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceByMemberDetailOptions({ memberId }));

	return (
		<>
			{data.attendance && (
				<ul className="flex justify-between rounded-xl bg-background-subtle px-5 py-[18px] text-body2">
					<li>
						<span className="mr-2 font-medium text-label-assistive">출석</span>
						<span className="font-semibold text-label-subtle">
							{data.attendance.presentCount ?? 0}
						</span>
					</li>
					<li>
						<span className="mr-2 font-medium text-label-assistive">결석</span>
						<span className="font-semibold text-label-subtle">
							{data.attendance.absentCount ?? 0}
						</span>
					</li>
					<li>
						<span className="mr-2 font-medium text-label-assistive">지각</span>
						<span className="font-semibold text-label-subtle">
							{data.attendance.lateCount ?? 0}
						</span>
					</li>
					<li>
						<span className="mr-2 font-medium text-label-assistive">인정</span>
						<span className="font-semibold text-label-subtle">
							{data.attendance.excusedAbsentCount ?? 0}
						</span>
					</li>
					<li>
						<span className="mr-2 font-medium text-label-assistive">조퇴</span>
						<span className="font-semibold text-label-subtle">
							{data.attendance.earlyLeaveCount ?? 0}
						</span>
					</li>
				</ul>
			)}
		</>
	);
};

const _AttendanceMemberSessions = ({
	memberId,
	onSessionClick,
}: {
	memberId: number;
	onSessionClick: (sessionId: number) => void;
}) => {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceByMemberDetailOptions({ memberId }));

	return (
		<section>
			<div className="flex flex-col">
				{data.sessions.map((session) => (
					<SessionItem key={session.id} {...session} onClick={() => onSessionClick(session.id)} />
				))}
			</div>
		</section>
	);
};

const SessionItem = (props: AttendanceSession & { onClick: () => void }) => {
	const { onClick, week, eventName, date, attendanceStatus } = props;
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex w-full items-center justify-between border-line-normal border-b px-3 py-4 text-left transition-colors hover:bg-gray-50"
		>
			<div>
				<p className="mb-0.5 font-medium text-caption1 text-label-assistive">{week}주차 세션</p>
				<p className="mb-0.5 font-semibold text-body1 text-label-normal">{eventName}</p>
				<p className="flex gap-2 font-medium text-caption1 text-label-assistive">
					<span className="flex items-center gap-0.5">
						<Calender />
						<time dateTime={date}>{formatDotFullDate(date)}</time>
					</span>
					<span className="flex items-center gap-0.5">
						<Clock />
						{formatTimeOnly(date)}
					</span>
				</p>
			</div>
			<AttendanceStatusLabel status={attendanceStatus} />
		</button>
	);
};

const _AttendanceSessionDetailView = ({
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

export const AttendanceMemberDetailDrawer = ({
	memberId,
	open,
	onOpenChange,
}: AttendanceMemberDetailDrawerProps) => {
	const [viewMode, setViewMode] = useState<'member' | 'session'>('member');
	const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

	const handleSessionClick = (sessionId: number) => {
		setSelectedSessionId(sessionId);
		setViewMode('session');
	};

	const handleBack = () => {
		setViewMode('member');
		setSelectedSessionId(null);
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(newOpen) => {
				onOpenChange(newOpen);
				if (!newOpen) {
					setViewMode('member');
					setSelectedSessionId(null);
				}
			}}
		>
			<SheetContent side="right" className="w-full p-0 sm:max-w-[600px]">
				{viewMode === 'member' ? (
					<>
						<SheetHeader className="flex-row items-center justify-between border-gray-200 border-b px-10 py-6">
							<SheetTitle className="font-semibold text-headline2 text-label-normal">
								멤버 상세
							</SheetTitle>
							<SheetClose asChild>
								<Button variant="none" size="none" className="size-6">
									<XCircle className="size-6 text-icon-normal" />
								</Button>
							</SheetClose>
						</SheetHeader>
						<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
							<Suspense fallback={<LoadingBox />}>
								<div className="flex-1 overflow-y-auto px-6 py-6">
									<section className="mb-10">
										<_AttendanceMemberHeader memberId={memberId} />
										<_AttendanceMemberDetailContent memberId={memberId} />
									</section>
									<_AttendanceMemberSessions
										memberId={memberId}
										onSessionClick={handleSessionClick}
									/>
								</div>
							</Suspense>
						</ErrorBoundary>
					</>
				) : (
					<>
						<AttendanceDetailHeader title="출석 상세" onBack={handleBack} />
						<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
							<Suspense fallback={<LoadingBox />}>
								{selectedSessionId && (
									<_AttendanceSessionDetailView memberId={memberId} sessionId={selectedSessionId} />
								)}
							</Suspense>
						</ErrorBoundary>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
};
