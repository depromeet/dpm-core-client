'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import dayjs from 'dayjs';
import type { SessionListItem } from '@dpm-core/api';
import { Aesterisk, Button, Calender, Clock, formatDotFullDate } from '@dpm-core/shared';

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

function SessionItem({ session }: { session: SessionListItem }) {
	const feedbackDaysRemaining = session.feedback
		? Math.max(0, dayjs(session.feedback.endAt).startOf('day').diff(dayjs().startOf('day'), 'day'))
		: null;
	const feedbackSearchParams =
		process.env.NODE_ENV === 'development'
			? '?mockAuthenticated=true&returnTo=%2Fsession'
			: '?returnTo=%2Fsession';

	return (
		<div className="px-4">
			<div className="flex flex-col gap-2.5 border-line-subtle border-b px-3 py-4">
				<Button
					size="none"
					variant="none"
					className="flex w-full cursor-pointer flex-col items-start text-left"
					asChild
				>
					<Link href={`/session/${session.id}`}>
						<div className="flex w-full flex-col gap-1.5">
							<div className="flex flex-col gap-0.5">
								<p className="font-medium text-caption1 text-label-assistive">
									{formatSessionWeekString(session.week)}
								</p>
								<h3 className="font-semibold text-body1 text-label-normal">
									{session.name}
								</h3>
							</div>
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
					</Link>
				</Button>
				{session.feedback?.canSubmit && (
					<Button
						variant="none"
						size="none"
						className="h-9 w-full rounded-lg border border-primary-normal bg-background-normal font-semibold text-caption1 text-primary-normal hover:bg-primary-extralight"
						asChild
					>
						<Link href={`/session/${session.id}/feedback${feedbackSearchParams}`}>
							피드백 남기기 (D-{feedbackDaysRemaining})
						</Link>
					</Button>
				)}
			</div>
		</div>
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
