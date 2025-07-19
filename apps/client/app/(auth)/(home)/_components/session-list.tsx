'use client';

import { Aesterisk } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Loading } from '@/components/lotties/loading';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getSessionListQuery } from '@/remotes/queries/session';
import { SessionCard } from './session-card';

const SessionListContainer = () => {
	const {
		data: { data },
	} = useSuspenseQuery(getSessionListQuery);
	return (
		<>
			{data.sessions?.length ? (
				<div className="my-5 px-4 flex-1">
					{data.sessions.map((session) => (
						<SessionCard
							key={session.id}
							subtitle={`${session.week}주차 세션`}
							title={session.eventName}
							startTimeInfo={formatISOStringToFullDateString(session.date)}
							endTimeInfo={formatISOStringToFullDateString(session.date)}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-y-3 flex-1">
					<Aesterisk />
					<p className="text-body1 font-semibold text-label-assistive">
						아직 등록된 세션 정보가 없어요
					</p>
				</div>
			)}
		</>
	);
};

const SessionList = ErrorBoundary.with(
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
		<Suspense
			fallback={
				<div className="flex flex-col items-center justify-center gap-y-3 flex-1">
					<Loading />
				</div>
			}
		>
			<SessionListContainer />
		</Suspense>
	),
);

export { SessionList };
