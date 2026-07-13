'use client';

import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Aesterisk, gaTrackHomeEnter } from '@dpm-core/shared';

import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getSessionCurrentOptions } from '@/remotes/queries/session';

import { SessionCard } from './session-card';

const HomeBannerListContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getSessionCurrentOptions());

	useEffect(() => {
		const sessionId = currentWeekSession?.id?.toString() || 'home';
		gaTrackHomeEnter(sessionId);
	}, [currentWeekSession]);

	if (!currentWeekSession)
		return (
			<Empty className="min-h-41.5">
				<EmptyHeader>
					<Aesterisk />
					<EmptyTitle>해당 주차에 대한 세션 정보가 없어요.</EmptyTitle>
				</EmptyHeader>
			</Empty>
		);

	return (
		<section className="my-2 min-h-0 flex-1 px-4">
			<SessionCard
				subtitle={`${currentWeekSession.week}주차 세션`}
				title={currentWeekSession.name}
				startTimeInfo={formatISOStringToFullDateString(currentWeekSession.date)}
				place={currentWeekSession.isOnline ? '온라인' : currentWeekSession.place}
			/>
		</section>
	);
};

// 배너는 부가 요소이므로 sessions/next 실패/로딩 시 조용히 숨긴다 (홈 전체가 깨지지 않도록)
export const HomeBannerList = ErrorBoundary.with(
	{ fallback: () => null },
	() => (
		<Suspense fallback={null}>
			<HomeBannerListContainer />
		</Suspense>
	),
);
