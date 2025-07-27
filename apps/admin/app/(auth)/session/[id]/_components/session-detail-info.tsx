'use client';

import {
	CopyButton,
	calcSessionAttendanceTime,
	calcSessionLateAttendanceTime,
	toast,
} from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { type PropsWithChildren, Suspense } from 'react';
import { ErrorBox } from '@/components/error-box';
import { Pressable } from '@/components/motion';
import { formatISOStringHHMM, formatISOStringToFullDateString } from '@/lib/date';
import { getSessionDetailQuery } from '@/remotes/queries/session';
import { EditSessionBottomSheet } from './edit-session-bottom-sheet';

const SessionDetailInfoContainer = ({ sessionId }: { sessionId: string }) => {
	const {
		data: { data: sessionDetail },
	} = useSuspenseQuery(getSessionDetailQuery(Number(sessionId)));

	const queryClient = useQueryClient();

	return (
		<div className="flex flex-col gap-y-5 p-4">
			<h3 className="text-headline2 font-semibold text-label-normal">{sessionDetail.eventName}</h3>
			<SessionDetailInfoBox label="세션 정보">
				<p className="text-body2 font-semibold text-label-assistive">세션 주차</p>
				<p className="text-body2 font-medium text-label-subtle">{`${sessionDetail.week}주차`}</p>
				<p className="text-body2 font-semibold text-label-assistive">세션명</p>
				<p className="text-body2 font-medium text-label-subtle">{sessionDetail.eventName}</p>
				<p className="text-body2 font-semibold text-label-assistive">세션 날짜</p>
				<p className="text-body2 font-medium text-label-subtle">
					{formatISOStringToFullDateString(sessionDetail.attendanceStartTime)}
				</p>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석 코드">
				<p className="text-body2 leading-none font-semibold text-label-assistive">출석 코드</p>
				<div className="flex items-center justify-between">
					<p className="text-body2 font-medium text-label-subtle">{sessionDetail.attendanceCode}</p>
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
						<Pressable variant="none" className="text-label-assistive text-body1 font-semibold">
							수정
						</Pressable>
					</EditSessionBottomSheet>
				}
			>
				<p className="text-body2 font-semibold text-label-assistive">출석 시간</p>
				<p className="text-body2 font-medium text-label-subtle">
					{formatISOStringHHMM(sessionDetail.attendanceStartTime)} -{' '}
					{formatISOStringHHMM(
						calcSessionAttendanceTime(
							dayjs(sessionDetail.attendanceStartTime).subtract(1, 'minute').toString(),
						).toISOString(),
					)}
				</p>

				<p className="text-body2 font-semibold text-label-assistive">지각 시간</p>
				<p className="text-body2 font-medium text-label-subtle">
					{formatISOStringHHMM(
						calcSessionAttendanceTime(sessionDetail.attendanceStartTime).toISOString(),
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
			<div className="flex justify-between items-center mb-2">
				<span className="text-body1 text-label-subtle font-semibold">{label}</span>
				{actions}
			</div>

			<div className="rounded-lg bg-background-subtle px-5 py-3 grid grid-cols-[70px_1fr] gap-x-4 gap-y-3 items-center">
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
