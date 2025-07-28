'use client';

import type { Session } from '@dpm-core/api';
import { Calender, ChevronRight, Clock, formatDotFullDate } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Suspense } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { Pressable } from '@/components/motion';
import { formatISOStringHHMM } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { getSessionListQuery } from '@/remotes/queries/session';

const SessionListContainer = () => {
	const {
		data: { data: sessionResponse },
	} = useSuspenseQuery(getSessionListQuery);
	return (
		<Virtuoso
			style={{ height: '100%' }}
			data={sessionResponse.sessions}
			itemContent={(_, session) => <SessionItem key={session.id} session={session} />}
			className="flex-1"
		/>
	);
};

function SessionItem({ session }: { session: Session }) {
	return (
		<Pressable asChild variant="none" className="block h-auto">
			<Link href={`/session/${session.id}`} className="px-4">
				<div className="px-3 py-4 flex items-center justify-between  border-b border-line-subtle">
					<div className="flex flex-col">
						<p className="text-caption1 font-medium text-label-assistive mb-0.5">
							{formatSessionWeekString(session.week)}
						</p>
						<h3 className="text-body1 font-semibold text-label-normal mb-1.5">
							{session.eventName}
						</h3>
						<div className="flex items-center gap-x-1">
							<Calender />
							<p className="text-caption1 font-medium text-label-assistive ml-0.5">
								{formatDotFullDate(session.date)}
							</p>

							<Clock className="ml-2" />

							<p className="text-caption1 font-medium text-label-assistive ml-0.5">
								{formatISOStringHHMM(session.date)}
							</p>
						</div>
					</div>
					<ChevronRight className="text-icon-noraml" />
				</div>
			</Link>
		</Pressable>
	);
}

const SessionList = ErrorBoundary.with(
	{
		fallback: (props) => <ErrorBox onReset={() => props.reset()} />,
	},
	() => (
		<Suspense fallback={<LoadingBox />}>
			<SessionListContainer />
		</Suspense>
	),
);

export { SessionList };
