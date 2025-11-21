'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { Session } from '@dpm-core/api';
import { Calender, Clock, formatDotFullDate } from '@dpm-core/shared';

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
			<div className="flex flex-col border-line-subtle border-b px-3 py-4">
				<p className="mb-0.5 font-medium text-caption1 text-label-assistive">
					{formatSessionWeekString(session.week)}
				</p>
				<h3 className="mb-1.5 font-semibold text-body1 text-label-normal">{session.name}</h3>
				<div className="flex items-center gap-x-1">
					<Calender />
					<p className="ml-0.5 font-medium text-caption1 text-label-assistive">
						{formatDotFullDate(session.date)}
					</p>

					<Clock className="ml-2" />
					<p className="ml-0.5 font-medium text-caption1 text-label-assistive">
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
