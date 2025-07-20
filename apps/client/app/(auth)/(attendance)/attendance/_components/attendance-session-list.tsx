'use client';

import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Suspense } from 'react';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getAttandanceMeOptions } from '@/remotes/queries/attendance';
import { SessionItem } from './attendance-session-item';

const AttendanceSessionListContainer = () => {
	const {
		data: { data: attendanceInfo },
	} = useSuspenseQuery(getAttandanceMeOptions());

	return (
		<section className="px-4">
			{attendanceInfo.sessions.map((session) => (
				<SessionItem key={session.id} {...session} />
			))}
		</section>
	);
};

export const AttendanceSessionList = ErrorBoundary.with(
	{
		fallback: (props) => {
			return <ErrorBox onReset={() => props.reset()} />;
		},
	},
	() => {
		return (
			<Suspense
				fallback={
					<div className="flex flex-col items-center justify-center gap-y-3 flex-1">
						<LoadingBox />
					</div>
				}
			>
				<AttendanceSessionListContainer />
			</Suspense>
		);
	},
);
