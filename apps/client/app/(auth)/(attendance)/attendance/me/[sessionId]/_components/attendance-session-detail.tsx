'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';

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
			<article className="mb-5 px-4">
				<h3 className="mb-3 font-semibold text-body1 text-label-subtle">출석 정보</h3>
				<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 font-semibold text-body2">
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">출석 상태</p>
						<AttendanceStatusLabel status={attendance.status} />
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">출석 시간</p>
						<p className="font-medium text-label-subtle">
							{formatISOStringToFullDateString(attendance.attendedAt)}
						</p>
					</div>
				</div>
			</article>
			<article className="mt-5 mb-5 px-4">
				<h3 className="mb-3 font-semibold text-body1 text-label-subtle">세션 정보</h3>
				<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 font-semibold text-body2">
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 주차</p>
						<p className="font-medium text-label-subtle">{session.week}주차</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션명</p>
						<p className="font-medium text-label-subtle">{session.eventName}</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 날짜</p>
						<p className="font-medium text-label-subtle">
							{formatISOStringToFullDateString(session.date)}
						</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 text-label-assistive">세션 장소</p>
						<p className="font-medium text-label-subtle">{session.place ?? '-'}</p>
					</div>
				</div>
			</article>
		</section>
	);
};

export const AttendanceSessionDetail = ({ sessionId }: AttendanceSessionDetailContainerProps) => {
	return (
		<ErrorBoundary
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceSessionDetailContainer sessionId={Number(sessionId)} />
			</Suspense>
		</ErrorBoundary>
	);
};
