'use client';

import { type PropsWithChildren, Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
	CopyButton,
	calcSessionAttendanceTime,
	GAPageTracker,
	useIsMobile,
} from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringHHMM, formatISOStringToFullDateString } from '@/lib/date';
import { getSessionDetailQuery } from '@/remotes/queries/session';

import { SessionDropDownMenu } from './SessionDropDownMenu';

interface SessionDetailInfoProps {
	sessionId: number;
}

const SessionDetailInfoContainer = (props: SessionDetailInfoProps) => {
	const { sessionId } = props;

	const {
		data: { data: sessionDetail },
	} = useSuspenseQuery(getSessionDetailQuery(Number(sessionId)));

	const isMobile = useIsMobile();

	return (
		<div className="flex flex-col gap-y-5 px-4 md:px-10">
			<GAPageTracker type="session-detail" sessionId={String(sessionId)} />
			<div className="flex items-center justify-between md:mt-6">
				<h3 className="font-semibold text-headline2 text-label-normal md:font-bold md:text-title1">
					{sessionDetail.name}
				</h3>
				{!isMobile && <SessionDropDownMenu sessionId={sessionId} />}
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
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석 코드">
				<p className="font-semibold text-body2 text-label-assistive leading-none">출석 코드</p>
				<div className="flex items-center justify-between">
					<p className="font-medium text-body2 text-label-subtle">{sessionDetail.attendanceCode}</p>
					<CopyButton value={sessionDetail.attendanceCode} />
				</div>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석/지각 시간">
				<p className="font-semibold text-body2 text-label-assistive">출석 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(sessionDetail.attendanceStart)} -{' '}
					{formatISOStringHHMM(
						calcSessionAttendanceTime(sessionDetail.attendanceStart).toISOString(),
					)}
				</p>

				<p className="font-semibold text-body2 text-label-assistive">지각 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(sessionDetail.lateStart)} -{' '}
					{formatISOStringHHMM(sessionDetail.absentStart)}
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
