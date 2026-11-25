'use client';

import { useEffect } from 'react';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Aesterisk, gaTrackHomeEnter, Skeleton } from '@dpm-core/shared';

import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { showAttendanceBanner } from '@/lib/attendance/banner';
import { getSessionCurrentOptions } from '@/remotes/queries/session';
import type { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

import type { AttendanceCheckBottomSheetOptions } from './attendance-check-bottom-sheet';
import { CohortEndedBanner } from './cohort-ended-banner';
import { HomeCheckAttendanceBanner, type HomeAttendanceQueries } from './home-attendance-banner';
import { HomeFeedbackCard } from './home-feedback-card';
import { SessionCard } from './session-card';

interface HomeBannerListProps {
	query?: ReturnType<typeof getSessionCurrentOptions>;
	feedbackQuery?: ReturnType<typeof getMyPendingSessionFeedbackQuery>;
	onSessionView?: (sessionId: string) => void;
	currentTime?: string;
	attendanceQueries?: HomeAttendanceQueries;
	attendanceSheet?: AttendanceCheckBottomSheetOptions;
}

export const HomeBannerList = ({
	query = getSessionCurrentOptions(),
	feedbackQuery,
	onSessionView = gaTrackHomeEnter,
	currentTime,
	attendanceQueries,
	attendanceSheet,
}: HomeBannerListProps) => (
	<ErrorBoundary
		fallback={
			<section className="px-4 pb-5">
				<HomeFeedbackCard
					isAttendanceOpen={false}
					query={feedbackQuery}
					currentTime={currentTime}
				/>
			</section>
		}
	>
		<Suspense fallback={<HomeSessionSkeleton />}>
			<HomeBannerListContainer
				query={query}
				feedbackQuery={feedbackQuery}
				onSessionView={onSessionView}
				currentTime={currentTime}
				attendanceQueries={attendanceQueries}
				attendanceSheet={attendanceSheet}
			/>
		</Suspense>
	</ErrorBoundary>
);

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

interface HomeBannerListContainerProps extends HomeBannerListProps {
	query: ReturnType<typeof getSessionCurrentOptions>;
	onSessionView: (sessionId: string) => void;
}

const HomeBannerListContainer = ({
	query,
	feedbackQuery,
	onSessionView,
	currentTime,
	attendanceQueries,
	attendanceSheet,
}: HomeBannerListContainerProps) => {
	const {
		data: { data: nextSessionHome },
	} = useSuspenseQuery(query);
	const currentWeekSession =
		nextSessionHome.status === 'AVAILABLE' ? (nextSessionHome.session ?? null) : null;

	useEffect(() => {
		const sessionId = currentWeekSession?.id?.toString() || 'home';
		onSessionView(sessionId);
	}, [currentWeekSession, onSessionView]);

	if (nextSessionHome.status === 'COHORT_ENDED') {
		return (
			<section className="flex flex-col gap-4 px-4 pb-5">
				<HomeFeedbackCard
					isAttendanceOpen={false}
					query={feedbackQuery}
					currentTime={currentTime}
				/>
				<CohortEndedBanner cohortValue={nextSessionHome.cohortValue} />
			</section>
		);
	}

	if (!currentWeekSession) {
		return (
			<section className="flex flex-col gap-4 px-4 pb-5">
				<HomeFeedbackCard
					isAttendanceOpen={false}
					query={feedbackQuery}
					currentTime={currentTime}
				/>
				<Empty className="h-43.5 rounded-lg bg-background-normal p-5">
					<EmptyHeader className="gap-6">
						<Aesterisk />
						<EmptyTitle>아직 등록된 세션 정보가 없어요</EmptyTitle>
					</EmptyHeader>
				</Empty>
			</section>
		);
	}

	const { canRecordAttendance, attendanceStart, absentStart } = currentWeekSession;

	const isAttendanceOpen =
		canRecordAttendance && showAttendanceBanner(attendanceStart, absentStart, currentTime);

	return (
		<section className="px-4 pb-5">
			<HomeCheckAttendanceBanner
				attendanceSession={currentWeekSession}
				isAttendanceOpen={isAttendanceOpen}
				currentTime={currentTime}
				queries={attendanceQueries}
				sheet={attendanceSheet}
			/>
			<div className="flex flex-col gap-4">
				<HomeFeedbackCard
					isAttendanceOpen={isAttendanceOpen}
					query={feedbackQuery}
					currentTime={currentTime}
				/>
				<SessionCard session={currentWeekSession} isAttendanceOpen={isAttendanceOpen} />
			</div>
		</section>
	);
};
