'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { SessionListItem } from '@dpm-core/api';
import { Button, Calender, ChevronRight, Clock, cn, formatDotFullDate } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { Pressable } from '@/components/motion';
import { formatISOStringHHMM } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { getSessionListQuery } from '@/remotes/queries/session';

const FEEDBACK_STATUS_LABEL = {
	SCHEDULED: '피드백 수집 예정',
	IN_PROGRESS: '피드백 수집 중',
	CLOSED: '피드백 결과 보기',
} as const;

const SessionListContainer = () => {
	const {
		data: { data: sessionResponse },
	} = useSuspenseQuery(getSessionListQuery);

	return (
		<div className="flex h-full w-full flex-col pb-15">
			<div className="mt-6 mb-5 hidden justify-between md:flex">
				<h3 className="flex items-center">
					<span className="mr-2 font-bold text-title1">세션 목록</span>
					<span className="text-primary-normal">{sessionResponse.sessions.length}</span>
				</h3>
				<div className="flex gap-4">
					<Button asChild size="md" variant="secondary">
						<Link href="/session/create">세션 추가</Link>
					</Button>
				</div>
			</div>
			<Virtuoso
				data={sessionResponse.sessions}
				className="[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2"
				itemContent={(_, session) => <SessionItem key={session.id} session={session} />}
			/>
		</div>
	);
};

function SessionItem({ session }: { session: SessionListItem }) {
	const params = useParams();
	const router = useRouter();

	const handleClickSession = (tab: 'info' | 'feedback' = 'info') => {
		const query = tab === 'feedback' ? '?tab=feedback' : '';
		const href = `/session/${session.id}${query}`;

		if (params.id) {
			router.replace(href, { scroll: false });
		} else {
			router.push(href, { scroll: false });
		}
	};

	const selected = Number(params.id) === session.id;
	const feedbackStatus = session.feedback?.status;
	const feedbackLabel = feedbackStatus ? FEEDBACK_STATUS_LABEL[feedbackStatus] : null;

	return (
		<div
			className={cn(
				'group flex w-full items-center border-line-subtle border-b px-3 py-4 hover:bg-background-strong',
				selected && 'bg-background-strong',
			)}
		>
			<Pressable
				variant="none"
				size="none"
				className="flex min-w-0 flex-1 items-center justify-between self-stretch text-left"
				onClick={() => handleClickSession('info')}
			>
				<div className="flex min-w-0 flex-1 flex-col">
					<p className="mb-0.5 font-medium text-caption1 text-label-assistive">
						{formatSessionWeekString(session.week)}
					</p>
					<h3 className="mb-1.5 truncate font-semibold text-body1 text-label-normal">
						{session.name}
					</h3>
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
				{!feedbackLabel && <ChevronRight className="size-4 flex-none text-icon-noraml" />}
			</Pressable>
			{feedbackLabel ? (
				<Button
					variant="none"
					size="none"
					className={cn(
						'ml-5 h-9 flex-none cursor-pointer justify-center rounded-md px-2 font-medium text-body2',
						feedbackStatus === 'CLOSED'
							? 'w-[116px] bg-primary-extralight text-primary-normal hover:bg-primary-light hover:text-primary-strong'
							: 'bg-background-strong text-label-assistive hover:bg-background-heavy hover:text-label-subtle',
						feedbackStatus === 'CLOSED' || feedbackStatus === 'SCHEDULED'
							? 'w-[116px]'
							: 'w-[104px]',
					)}
					onClick={() => handleClickSession('feedback')}
				>
					{feedbackLabel}
				</Button>
			) : null}
			{feedbackLabel ? (
				<Pressable
					variant="none"
					size="none"
					className="ml-5 flex size-4 flex-none cursor-pointer items-center justify-center"
					aria-label={`${session.name} 정보 보기`}
					onClick={() => handleClickSession('info')}
				>
					<ChevronRight className="size-4 text-icon-noraml" />
				</Pressable>
			) : null}
		</div>
	);
}

export const SessionList = () => {
	return (
		<ErrorBoundary
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense
				fallback={
					<div className="flex h-full flex-col">
						<LoadingBox />
					</div>
				}
			>
				<SessionListContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
