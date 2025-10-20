'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { session } from '@dpm-core/api';
import { ChevronRight } from '@dpm-core/shared';

import { Pressable } from '@/components/motion';
import { showAttendanceCodeBanner } from '@/lib/attendance/banner';
import { formatSessionWeekString } from '@/lib/session/format';

const SessionBannerContainer = () => {
	const { data: currentWeekSession } = useSuspenseQuery({
		queryKey: ['session-current-week', 'session-detail'],
		queryFn: async () => {
			const { data: currentWeekSession } = await session.getCurrentWeekSession();
			if (!currentWeekSession) return null;
			const { data: sessionDetail } = await session.getSessionById(currentWeekSession.sessionId);
			return {
				...currentWeekSession,
				...sessionDetail,
			};
		},
		gcTime: 0,
	});

	if (!currentWeekSession) return null;

	if (!showAttendanceCodeBanner(currentWeekSession.date)) return null;

	return (
		<Pressable
			variant="none"
			// 48px -> 앱 헤더 높이
			className="sticky top-[48px] flex h-[42px] items-center justify-between rounded-none bg-primary-normal px-4 py-3"
			asChild
		>
			<Link href={`/session/${currentWeekSession.sessionId}`}>
				<span className="text-white">
					{formatSessionWeekString(currentWeekSession.week)} 출석 코드 :{' '}
					{currentWeekSession.attendanceCode}
				</span>
				<ChevronRight className="text-white" />
			</Link>
		</Pressable>
	);
};

const SessionBanner = ErrorBoundary.with(
	{
		fallback: <></>,
	},
	() => (
		<Suspense>
			<SessionBannerContainer />
		</Suspense>
	),
);

export { SessionBanner };
