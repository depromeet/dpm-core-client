'use client';

import { useEffect } from 'react';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Aesterisk, gaTrackHomeEnter, Skeleton } from '@dpm-core/shared';

import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { showAttendanceBanner } from '@/lib/attendance/banner';
import { getSessionCurrentOptions } from '@/remotes/queries/session';

import { HomeCheckAttendanceBanner } from './home-attendance-banner';
import { SessionCard } from './session-card';

// 배너 오류는 홈의 다른 콘텐츠에 영향을 주지 않도록 격리한다.
export const HomeBannerList = ErrorBoundary.with({ fallback: () => null }, () => (
	<Suspense fallback={<HomeSessionSkeleton />}>
		<HomeBannerListContainer />
	</Suspense>
));

const HomeSessionSkeleton = () => (
	<output className="block px-4 pb-5" aria-label="세션 정보 불러오는 중">
		<div className="h-43.5 rounded-lg bg-background-normal p-5">
			<Skeleton className="mb-2 h-4 w-16 bg-background-subtle" />
			<Skeleton className="h-5 w-3/5 bg-background-subtle" />
			<div className="my-4 h-px bg-line-normal" />
			<Skeleton className="mb-3 h-4 w-4/5 bg-background-subtle" />
			<Skeleton className="h-4 w-2/3 bg-background-subtle" />
		</div>
	</output>
);

const HomeBannerListContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getSessionCurrentOptions());

	useEffect(() => {
		const sessionId = currentWeekSession?.id?.toString() || 'home';
		gaTrackHomeEnter(sessionId);
	}, [currentWeekSession]);

	if (!currentWeekSession) {
		return (
			<section className="px-4 pb-5">
				<Empty className="h-43.5 rounded-lg bg-background-normal p-5">
					<EmptyHeader className="gap-6">
						<Aesterisk />
						<EmptyTitle>아직 등록된 세션 정보가 없어요</EmptyTitle>
					</EmptyHeader>
				</Empty>
			</section>
		);
	}

	const isAttendanceOpen = showAttendanceBanner(
		currentWeekSession.attendanceStart,
		currentWeekSession.lateStart,
		currentWeekSession.absentStart,
	);

	return (
		<section className="px-4 pb-5">
			<HomeCheckAttendanceBanner
				attendanceSession={currentWeekSession}
				isAttendanceOpen={isAttendanceOpen}
			/>
			<SessionCard session={currentWeekSession} isAttendanceOpen={isAttendanceOpen} />
		</section>
	);
};
