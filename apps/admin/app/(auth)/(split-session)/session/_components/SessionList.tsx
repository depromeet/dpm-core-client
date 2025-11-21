'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { Session } from '@dpm-core/api';
import { Button, Calender, ChevronRight, Clock, cn, formatDotFullDate } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { Pressable } from '@/components/motion';
import { formatISOStringHHMM } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { getSessionListQuery } from '@/remotes/queries/session';

import { SessionInfoModifyModal } from './SessionInfoModifyModal';

const SessionListContainer = () => {
	const {
		data: { data: sessionResponse },
	} = useSuspenseQuery(getSessionListQuery);

	return (
		<div className="flex h-full w-full flex-col px-4 pb-15 md:px-0">
			<div className="mt-6 mb-5 hidden justify-between md:flex">
				<h3 className="flex items-center">
					<span className="mr-2 font-bold text-title1">세션 목록</span>
					<span className="text-primary-normal">{sessionResponse.sessions.length}</span>
				</h3>
				<div className="flex gap-4">
					<SessionInfoModifyModal />
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

function SessionItem({ session }: { session: Session }) {
	const params = useParams();
	const router = useRouter();

	const handleClickSession = () => {
		if (Number(params.id) === session.id) return;

		if (params.id) {
			router.replace(`/session/${session.id}`, { scroll: false });
		} else {
			router.push(`/session/${session.id}`, { scroll: false });
		}
	};

	const selected = Number(params.id) === session.id;

	return (
		<Pressable
			data-no-close
			variant="none"
			size="none"
			asChild
			className={cn(
				'block h-auto w-full border-line-subtle border-b px-3 py-4 hover:bg-background-strong',
				selected && 'bg-background-strong',
			)}
			onClick={handleClickSession}
		>
			<div className="flex w-full items-center justify-between">
				<div className="flex flex-1 flex-col">
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
				<ChevronRight className="text-icon-noraml" />
			</div>
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
