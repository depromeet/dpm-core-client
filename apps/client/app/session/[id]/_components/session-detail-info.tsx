'use client';

import { type PropsWithChildren, Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { GAPageTracker } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringHHMM, formatISOStringToFullDateString } from '@/lib/date';
import { getAttendanceMeBySessionIdOptions } from '@/remotes/queries/attendance';
import { getSessionDetailQuery } from '@/remotes/queries/session';

interface SessionDetailInfoProps {
	sessionId: number;
}

const SessionDetailInfoContainer = (props: SessionDetailInfoProps) => {
	const { sessionId } = props;

	const [
		{
			data: { data: sessionDetail },
		},
		{
			data: {
				data: { attendance },
			},
		},
	] = useSuspenseQueries({
		queries: [getSessionDetailQuery(sessionId), getAttendanceMeBySessionIdOptions({ sessionId })],
	});

	return (
		<div className="scrollbar-hide flex flex-1 flex-col gap-y-5 overflow-auto px-4 pb-5">
			<GAPageTracker type="session-detail" sessionId={String(sessionId)} />
			<div className="flex items-center justify-between md:mt-6">
				<h3 className="font-semibold text-headline2 text-label-normal md:font-bold md:text-title1">
					{sessionDetail.name}
				</h3>
			</div>

			<SessionDetailInfoBox label="세션 정보">
				<p className="font-semibold text-body2 text-label-assistive">세션 주차</p>
				<p className="font-medium text-body2 text-label-subtle">{`${sessionDetail.week}주차`}</p>
				<p className="font-semibold text-body2 text-label-assistive">세션명</p>
				<p className="font-medium text-body2 text-label-subtle">{sessionDetail.name}</p>
				<p className="font-semibold text-body2 text-label-assistive">세션 날짜</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringToFullDateString(sessionDetail.date)}
				</p>
				<p className="font-semibold text-body2 text-label-assistive">세션 장소</p>
				<p className="font-medium text-body2 text-label-subtle">
					{sessionDetail.isOnline ? '온라인' : sessionDetail.place}
				</p>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석/지각 시간">
				<p className="font-semibold text-body2 text-label-assistive">출석 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(sessionDetail.attendanceStart)} -{' '}
					{dayjs(sessionDetail.lateStart).subtract(1, 'minute').format('HH:mm')}
				</p>

				<p className="font-semibold text-body2 text-label-assistive">지각 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(sessionDetail.lateStart)} -{' '}
					{dayjs(sessionDetail.absentStart).subtract(1, 'minute').format('HH:mm')}
				</p>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석 정보">
				<p className="font-semibold text-body2 text-label-assistive">출석 상태</p>
				<AttendanceStatusLabel status={attendance.status} />
				<p className="font-semibold text-body2 text-label-assistive">출석 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringToFullDateString(attendance.attendedAt)}
				</p>
			</SessionDetailInfoBox>
		</div>
	);
};

interface SessionDetailInfoBoxProps {
	label: string;
	actions?: React.ReactNode;
}

const SessionDetailInfoBox = ({
	label,
	actions,
	children,
}: PropsWithChildren<SessionDetailInfoBoxProps>) => {
	return (
		<div className="flex flex-col">
			<div className="mb-2 flex items-center justify-between">
				<span className="font-semibold text-body1 text-label-subtle">{label}</span>
				{actions}
			</div>

			<div className="grid grid-cols-[70px_1fr] items-center gap-x-4 gap-y-3 rounded-lg bg-background-subtle px-5 py-3">
				{children}
			</div>
		</div>
	);
};

export const SessionDetailInfo = ({ sessionId }: SessionDetailInfoProps) => {
	return (
		<ErrorBoundary
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense fallback={<LoadingBox />}>
				<SessionDetailInfoContainer sessionId={sessionId} />
			</Suspense>
		</ErrorBoundary>
	);
};
