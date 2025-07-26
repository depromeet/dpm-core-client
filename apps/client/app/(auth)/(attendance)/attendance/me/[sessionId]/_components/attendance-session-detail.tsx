'use client';

import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getAttendanceMeBySessionIdOptions } from '@/remotes/queries/attendance';

interface AttendanceSessionDetailContainerProps {
	sessionId: number;
}

const AttendanceSessionDetailContainer = ({ sessionId }: AttendanceSessionDetailContainerProps) => {
	const {
		data: {
			data: { session, attendance },
		},
	} = useSuspenseQuery(getAttendanceMeBySessionIdOptions({ sessionId }));

	return (
		<section className="mt-5">
			<article className="px-4 mb-5">
				<h3 className="text-label-subtle text-body1 font-semibold mb-3">출석 정보</h3>
				<div className="flex flex-col gap-3 bg-background-subtle py-3 px-5 rounded-lg font-semibold text-body2">
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">출석 상태</p>
						<AttendanceStatusLabel status={attendance.status} />
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">출석 시간</p>
						<p className="text-label-subtle font-medium">
							{formatISOStringToFullDateString(attendance.attendedAt)}
						</p>
					</div>
				</div>
			</article>
			<article className="mt-5 px-4 mb-5">
				<h3 className="text-label-subtle text-body1 font-semibold mb-3">세션 정보</h3>
				<div className="flex flex-col gap-3 bg-background-subtle py-3 px-5 rounded-lg font-semibold text-body2">
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 주차</p>
						<p className="text-label-subtle font-medium">{session.week}주차</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션명</p>
						<p className="text-label-subtle font-medium">{session.eventName}</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 날짜</p>
						<p className="text-label-subtle font-medium">
							{formatISOStringToFullDateString(session.date)}
						</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 장소</p>
						<p className="text-label-subtle font-medium">{session.place ?? '-'}</p>
					</div>
				</div>
			</article>
		</section>
	);
};

export const AttendanceSessionDetail = ({ sessionId }: AttendanceSessionDetailContainerProps) => {
	return (
		<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceSessionDetailContainer sessionId={Number(sessionId)} />
			</Suspense>
		</ErrorBoundary>
	);
};
