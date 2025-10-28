'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Aesterisk, Button, ChevronRight, gaTrackHomeEnter } from '@dpm-core/shared';

import { Loading } from '@/components/lotties/loading';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getCurrentWeekSessionQuery } from '@/remotes/queries/session';

import { SessionCard } from './session-card';

const CurrentWeekSessionContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getCurrentWeekSessionQuery);

	useEffect(() => {
		const sessionId = currentWeekSession?.sessionId?.toString() || 'home';
		gaTrackHomeEnter(sessionId);
	}, [currentWeekSession]);

	return (
		<>
			<div className="mb-3.5 hidden items-center gap-3 md:flex">
				<h3 className="font-bold text-label-normal text-title1">세션</h3>
				<Button variant="text" className="gap-0" asChild>
					<Link href="/session">
						전체보기
						<ChevronRight className="size-4" />
					</Link>
				</Button>
			</div>
			{currentWeekSession ? (
				<SessionCard
					subtitle={`${currentWeekSession.week}주차 세션`}
					title={currentWeekSession.eventName}
					startTimeInfo={formatISOStringToFullDateString(currentWeekSession.date)}
					place={currentWeekSession.isOnline ? '온라인' : currentWeekSession.place}
					sessionId={currentWeekSession.sessionId.toString()}
				/>
			) : (
				<div className="flex h-[166px] flex-col items-center justify-center">
					<Aesterisk />
					<p className="font-semibold text-body1 text-label-assistive">
						아직 등록된 세션 정보가 없어요
					</p>
				</div>
			)}
		</>
	);
};

const CurrentWeekSession = () => (
	<ErrorBoundary
		fallback={(props) => {
			return (
				<div className="flex h-full flex-col items-center justify-center">
					<p className="font-semibold text-body2">세선 정보 조회에 실패했어요.</p>
					<Button type="button" onClick={() => props.reset()}>
						다시 시도
					</Button>
				</div>
			);
		}}
	>
		<Suspense fallback={<Loading />}>
			<CurrentWeekSessionContainer />
		</Suspense>
	</ErrorBoundary>
);

export { CurrentWeekSession };
