'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Aesterisk, Button, ChevronRight, gaTrackHomeEnter } from '@dpm-core/shared';

import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getCurrentWeekSessionQuery } from '@/remotes/queries/session';

import { SessionCard } from './session-card';
import { useSession } from './session-provider';

const CurrentWeekSessionContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getCurrentWeekSessionQuery);
	const { sessions } = useSession();

	const nextWeekSession = useMemo(() => {
		if (!currentWeekSession || !sessions?.length) return null;
		return sessions.find((session) => session.week === currentWeekSession.week + 1) || null;
	}, [sessions, currentWeekSession]);

	useEffect(() => {
		const sessionId = currentWeekSession?.id?.toString() || 'home';
		gaTrackHomeEnter(sessionId);
	}, [currentWeekSession]);

	const renderSessionCards = () => {
		if (!currentWeekSession) {
			return (
				<div className="flex h-[166px] flex-col items-center justify-center">
					<Aesterisk />
					<p className="font-semibold text-body1 text-label-assistive">
						아직 등록된 세션 정보가 없어요
					</p>
				</div>
			);
		}

		return (
			<div className="flex gap-3">
				<SessionCard
					className="flex-1"
					subtitle={`${currentWeekSession.week}주차 세션`}
					title={currentWeekSession.name}
					startTimeInfo={formatISOStringToFullDateString(currentWeekSession.date)}
					place={currentWeekSession.isOnline ? '온라인' : currentWeekSession.place}
					sessionId={currentWeekSession.id.toString()}
				/>

				{nextWeekSession && (
					<SessionCard
						className="hidden flex-1 md:flex"
						subtitle={`${nextWeekSession.week}주차 세션`}
						title={nextWeekSession.name}
						startTimeInfo={formatISOStringToFullDateString(nextWeekSession.date)}
						place={currentWeekSession.isOnline ? '온라인' : currentWeekSession.place}
						sessionId={nextWeekSession.id.toString()}
					/>
				)}
			</div>
		);
	};

	return (
		<section>
			<div className="mb-3.5 hidden items-center gap-3 md:flex">
				<h3 className="font-bold text-label-normal text-title1">세션</h3>
				<Button variant="text" className="gap-0" asChild>
					<Link href="/session">
						전체보기
						<ChevronRight className="size-4" />
					</Link>
				</Button>
			</div>

			{renderSessionCards()}
		</section>
	);
};

const CurrentWeekSession = () => (
	<ErrorBoundary
		fallback={(props) => (
			<div className="flex h-full flex-col items-center justify-center">
				<p className="font-semibold text-body2">세션 정보 조회에 실패했어요.</p>
				<Button type="button" onClick={() => props.reset()}>
					다시 시도
				</Button>
			</div>
		)}
	>
		<Suspense fallback={<LoadingBox />}>
			<CurrentWeekSessionContainer />
		</Suspense>
	</ErrorBoundary>
);

export { CurrentWeekSession };
