'use client';

import { Aesterisk } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Loading } from '@/components/lotties/loading';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getSessionCurrentOptions } from '@/remotes/queries/session';
import { SessionCard } from './session-card';

const CurrentWeekSessionContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getSessionCurrentOptions());

	return (
		<>
			{currentWeekSession ? (
				<SessionCard
					id={currentWeekSession.sessionId.toString()}
					subtitle={`${currentWeekSession.week}주차 세션`}
					title={currentWeekSession.eventName}
					startTimeInfo={formatISOStringToFullDateString(currentWeekSession.date)}
					place={currentWeekSession.isOnline ? '온라인' : currentWeekSession.place}
				/>
			) : (
				<div className="flex flex-col items-center justify-center h-[166px]">
					<Aesterisk />
					<p className="text-body1 font-semibold text-label-assistive">
						아직 등록된 세션 정보가 없어요
					</p>
				</div>
			)}
		</>
	);
};

const CurrentWeekSession = ErrorBoundary.with(
	{
		fallback: (props) => {
			return (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-body2 font-semibold">세선 정보 조회에 실패했어요.</p>
					<button type="button" onClick={() => props.reset()}>
						다시 시도
					</button>
				</div>
			);
		},
	},
	() => (
		<Suspense fallback={<Loading />}>
			<CurrentWeekSessionContainer />
		</Suspense>
	),
);

export { CurrentWeekSession };
