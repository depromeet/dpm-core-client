'use client';

import { Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { Session } from '@dpm-core/api';
import { Aesterisk, Calender, Clock, formatDotFullDate, toast } from '@dpm-core/shared';

import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringHHMM } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { getSessionListQuery } from '@/remotes/queries/session';

const SessionListContainer = () => {
	const {
		data: { data: sessionResponse },
	} = useSuspenseQuery(getSessionListQuery);

	if (sessionResponse.sessions.length === 0) {
		return (
			<Empty className="h-full min-h-41.5">
				<EmptyHeader>
					<Aesterisk />
					<EmptyTitle>등록된 세션이 없어요</EmptyTitle>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<Virtuoso
			data={sessionResponse.sessions}
			itemContent={(_, session) => <SessionItem key={session.id} session={session} />}
			className="scrollbar-hide flex-1"
		/>
	);
};

function SessionItem({ session }: { session: Session }) {
	const handleClick = () => {
		toast.light('디퍼에게는 세션 상세 정보를 제공하지 않아요.');
	};

	return (
		<button type="button" className="w-full cursor-pointer px-4 text-left" onClick={handleClick}>
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
		</button>
	);
}

export const SessionList = () => {
	return (
		<ErrorBoundary
			fallback={(props: ErrorBoundaryFallbackProps) => <ErrorBox onReset={props.reset} />}
		>
			<Suspense fallback={<LoadingBox />}>
				<SessionListContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
