'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Button, ChevronLeft } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getAttendanceBySessionDetailOptions } from '@/remotes/queries/attendance';

import { AttendanceMemberInfo } from '../../_components/attendance-member-info';
import { AttendanceModifyStatus } from './attendance-modify-status';

interface AttendanceSessionDetailContainerProps {
	memberId: number;
	sessionId: number;
}

const _AttendanceSessionDetailContainer = (props: AttendanceSessionDetailContainerProps) => {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceBySessionDetailOptions(props));
	const router = useRouter();

	return (
		<>
			<header className="sticky top-0 flex h-12 items-center justify-between bg-gray-0 px-4 py-3">
				<Button variant="none" size="none" onClick={() => router.back()} asChild>
					<ChevronLeft />
				</Button>
				<h1 className="-translate-x-1/2 absolute left-1/2 font-semibold text-body1">출석 상세</h1>
			</header>
			<AttendanceMemberInfo member={data?.member} />
			<section className="mt-5 px-4">
				<article className="mb-5">
					<div className="mb-2 flex items-center justify-between">
						<h3 className="font-semibold text-body1 text-label-subtle">출석 정보</h3>
						{data?.attendance.updatedAt && (
							<p className="font-medium text-label-subtle text-xs">
								{formatISOStringToFullDateString(data.attendance.updatedAt)} 저장됨
							</p>
						)}
					</div>
					<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 font-semibold text-body2">
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 상태</p>
							<AttendanceStatusLabel status={data?.attendance.status} />
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 시간</p>
							<p className="font-medium text-label-subtle">
								{formatISOStringToFullDateString(data?.attendance.attendedAt)}
							</p>
						</div>
					</div>
				</article>
				<article>
					<h3 className="mb-2 font-semibold text-body1 text-label-subtle">세션 정보</h3>
					<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 font-semibold text-body2">
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">세션 주차</p>
							<p className="font-medium text-label-subtle">{data?.session.week}주차</p>
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">세션명</p>
							<p className="font-medium text-label-subtle">{data?.session.eventName}</p>
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">세션 날짜</p>
							<p className="font-medium text-label-subtle">
								{formatISOStringToFullDateString(data?.session.date)}
							</p>
						</div>
					</div>
				</article>
			</section>
			<AttendanceModifyStatus
				sessionId={props.sessionId}
				member={data?.member}
				attendanceStatus={data.attendance.status}
			/>
		</>
	);
};

export const AttendanceSessionDetailContainer = (props: AttendanceSessionDetailContainerProps) => {
	return (
		<ErrorBoundary fallback>
			<Suspense>
				<_AttendanceSessionDetailContainer {...props} />
			</Suspense>
		</ErrorBoundary>
	);
};
