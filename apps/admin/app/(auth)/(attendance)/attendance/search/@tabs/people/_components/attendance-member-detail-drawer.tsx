'use client';

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
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Suspense } from 'react';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { Profile } from '@/components/attendance/profile';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getAttendanceMemberStatusLabel } from '@/lib/attendance/status';
import { getAttendanceByMemberDetailOptions } from '@/remotes/queries/attendance';

interface AttendanceMemberDetailDrawerProps {
	memberId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const _AttendanceMemberDetailContent = ({ memberId }: { memberId: number }) => {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceByMemberDetailOptions({ memberId }));

	return (
		<>
			<SheetHeader className="flex-row items-center justify-between border-gray-200 border-b px-10 py-6">
				<SheetTitle className="font-semibold text-headline2 text-label-normal">
					{data.member.name}
				</SheetTitle>
				<SheetClose asChild>
					<Button variant="none" size="none" className="size-6">
						<XCircle className="size-6 text-icon-normal" />
					</Button>
				</SheetClose>
			</SheetHeader>

			<div className="flex-1 overflow-y-auto px-6 py-6">
				{/* 멤버 정보 섹션 */}
				<section className="mb-10">
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
				</section>

				{/* 세션 리스트 섹션 */}
				<section>
					<div className="flex flex-col">
						{data.sessions.map((session) => (
							<SessionItem key={session.id} memberId={memberId} {...session} />
						))}
					</div>
				</section>
			</div>
		</>
	);
};

const SessionItem = (props: AttendanceSession & { memberId: number }) => {
	const { memberId, id: sessionId, week, eventName, date, attendanceStatus } = props;
	return (
		<Link
			href={`/attendance/${memberId}/${sessionId}`}
			className="flex w-full items-center justify-between border-line-normal border-b px-3 py-4"
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
		</Link>
	);
};

export const AttendanceMemberDetailDrawer = ({
	memberId,
	open,
	onOpenChange,
}: AttendanceMemberDetailDrawerProps) => {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full p-0 sm:max-w-[600px]">
				<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
					<Suspense fallback={<LoadingBox />}>
						<_AttendanceMemberDetailContent memberId={memberId} />
					</Suspense>
				</ErrorBoundary>
			</SheetContent>
		</Sheet>
	);
};
