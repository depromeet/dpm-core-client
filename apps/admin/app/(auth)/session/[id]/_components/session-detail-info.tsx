'use client';

import { type PropsWithChildren, Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
	CopyButton,
	calcSessionAttendanceTime,
	calcSessionLateAttendanceTime,
	GAPageTracker,
	toast,
} from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { Pressable } from '@/components/motion';
import { formatISOStringHHMM, formatISOStringToFullDateString } from '@/lib/date';
import { getSessionDetailQuery } from '@/remotes/queries/session';

import { EditSessionBottomSheet } from './edit-session-bottom-sheet';

function addOneMinute(date: string) {
	return dayjs(date).add(1, 'minute').toISOString();
}

const SessionDetailInfoContainer = ({ sessionId }: { sessionId: string }) => {
	const {
		data: { data: sessionDetail },
	} = useSuspenseQuery(getSessionDetailQuery(Number(sessionId)));

	const queryClient = useQueryClient();

	return (
		<div className="flex flex-col gap-y-5 p-4">
			<GAPageTracker type="session-detail" sessionId={sessionId} />
			<h3 className="font-semibold text-headline2 text-label-normal">{sessionDetail.eventName}</h3>
			<SessionDetailInfoBox label="세션 정보">
				<p className="font-semibold text-body2 text-label-assistive">세션 주차</p>
				<p className="font-medium text-body2 text-label-subtle">{`${sessionDetail.week}주차`}</p>
				<p className="font-semibold text-body2 text-label-assistive">세션명</p>
				<p className="font-medium text-body2 text-label-subtle">{sessionDetail.eventName}</p>
				<p className="font-semibold text-body2 text-label-assistive">세션 날짜</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringToFullDateString(sessionDetail.attendanceStartTime)}
				</p>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석 코드">
				<p className="font-semibold text-body2 text-label-assistive leading-none">출석 코드</p>
				<div className="flex items-center justify-between">
					<p className="font-medium text-body2 text-label-subtle">{sessionDetail.attendanceCode}</p>
					<CopyButton value={sessionDetail.attendanceCode} />
				</div>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox
				label="출석/지각 시간"
				actions={
					<EditSessionBottomSheet
						attendanceStartTime={sessionDetail.attendanceStartTime}
						sessionId={sessionId}
						onSuccess={() => {
							queryClient.invalidateQueries(getSessionDetailQuery(Number(sessionId)));
							toast.success('출석 시간이 수정되었습니다.');
						}}
					>
						<Pressable variant="none" className="font-semibold text-body1 text-label-assistive">
							수정
						</Pressable>
					</EditSessionBottomSheet>
				}
			>
				<p className="font-semibold text-body2 text-label-assistive">출석 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(sessionDetail.attendanceStartTime)} -{' '}
					{formatISOStringHHMM(
						calcSessionAttendanceTime(sessionDetail.attendanceStartTime).toISOString(),
					)}
				</p>

				<p className="font-semibold text-body2 text-label-assistive">지각 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(
						calcSessionAttendanceTime(
							addOneMinute(sessionDetail.attendanceStartTime),
						).toISOString(),
					)}{' '}
					-{' '}
					{formatISOStringHHMM(
						calcSessionLateAttendanceTime(sessionDetail.attendanceStartTime).toISOString(),
					)}
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

const SessionDetailInfo = ErrorBoundary.with(
	{
		fallback: () => <ErrorBox />,
	},
	({ sessionId }: { sessionId: string }) => (
		<Suspense>
			<SessionDetailInfoContainer sessionId={sessionId} />
		</Suspense>
	),
);

export default SessionDetailInfo;
