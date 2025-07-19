'use client';

import { ChevronRight } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'next-view-transitions';
import { Suspense } from 'react';
import { Pressable } from '@/components/motion';
import { formatSessionWeekString } from '@/lib/session/format';
import { getCurrentWeekSessionQuery } from '@/remotes/queries/session';

const SessionBannerContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getCurrentWeekSessionQuery);
	if (!currentWeekSession) return null;
	return (
		<Pressable
			variant="none"
			whileHover={{}}
			className="py-3 px-4 bg-primary-normal flex items-center justify-between rounded-none"
			asChild
		>
			<Link href={`/session/${currentWeekSession.sessionId}`}>
				<span className="text-white">
					{formatSessionWeekString(currentWeekSession.week)} 출석 코드 : 0000
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
