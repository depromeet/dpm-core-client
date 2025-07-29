'use client';

import type { Session } from '@dpm-core/api';
import { Calender, Clock, formatDotFullDate } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringHHMM } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { getSessionListQuery } from '@/remotes/queries/session';

const SessionListContainer = () => {
	const {
		data: { data: sessionResponse },
	} = useSuspenseQuery(getSessionListQuery);
	return (
		<Virtuoso
			data={sessionResponse.sessions}
			itemContent={(_, session) => <SessionItem key={session.id} session={session} />}
			className="flex-1"
		/>
	);
};

function SessionItem({ session }: { session: Session }) {
	return (
		<div className="px-4">
			<div className="px-3 py-4 flex flex-col border-b border-line-subtle">
				<p className="text-caption1 font-medium text-label-assistive mb-0.5">
					{formatSessionWeekString(session.week)}
				</p>
				<h3 className="text-body1 font-semibold text-label-normal mb-1.5">{session.eventName}</h3>
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
		</div>
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
