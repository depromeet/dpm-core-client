'use client';

import { session } from '@dpm-core/api';
import { ChevronRight } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'next-view-transitions';
import { Suspense } from 'react';
import { Pressable } from '@/components/motion';
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

	return (
		<Pressable
			variant="none"
			whileHover={{}}
			// 48px -> 앱 헤더 높이
			className="py-3 px-4 bg-primary-normal flex items-center justify-between rounded-none sticky top-[48px] h-[42px]"
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
