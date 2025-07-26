'use client';

import { Button, ChevronLeft } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
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
			<header className="h-12 bg-gray-0 sticky top-0 py-3 px-4 flex items-center justify-between">
				<Button variant="none" size="none" onClick={() => router.back()} asChild>
					<ChevronLeft />
				</Button>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">출석 상세</h1>
			</header>
			<AttendanceMemberInfo member={data?.member} />
			<section className="px-4 mt-5">
				<article className="mb-5">
					<h3 className="text-label-subtle text-body1 font-semibold mb-2">출석 정보</h3>
					<div className="flex flex-col gap-3 bg-background-subtle py-3 px-5 rounded-lg font-semibold text-body2">
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 상태</p>
							<AttendanceStatusLabel status={data?.attendance.status} />
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 시간</p>
							<p className="text-label-subtle font-medium">
								{formatISOStringToFullDateString(data?.attendance.attendedAt)}
							</p>
						</div>
					</div>
				</article>
				<article>
					<h3 className="text-label-subtle text-body1 font-semibold mb-2">세션 정보</h3>
					<div className="flex flex-col gap-3 bg-background-subtle py-3 px-5 rounded-lg font-semibold text-body2">
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">세션 주차</p>
							<p className="text-label-subtle font-medium">{data?.session.week}주차</p>
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">세션명</p>
							<p className="text-label-subtle font-medium">{data?.session.eventName}</p>
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">세션 날짜</p>
							<p className="text-label-subtle font-medium">
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
