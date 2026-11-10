'use client';

import Link from 'next/link';
import { Suspense, useCallback, useRef } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { Virtuoso } from 'react-virtuoso';
import type { SessionListItem } from '@dpm-core/api';
import { Aesterisk, Button, Calender, Clock, formatDotFullDate } from '@dpm-core/shared';

import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useFeedbackImpression } from '@/hooks/use-feedback-impression';
import { formatISOStringHHMM } from '@/lib/date';
import { getFeedbackDaysRemaining } from '@/lib/session/feedback';
import { formatSessionWeekString } from '@/lib/session/format';
import { useClarity } from '@/providers/client-clarity-adapter';
import { getSessionListQuery } from '@/remotes/queries/session';

const SessionListContainer = () => {
	const {
		data: { data: sessionResponse },
	} = useSuspenseQuery(getSessionListQuery);
	const { track } = useClarity();
	const viewedSessionIdsRef = useRef(new Set<number>());
	const handleFeedbackView = useCallback(
		(sessionId: number) => {
			if (viewedSessionIdsRef.current.has(sessionId)) return;
			viewedSessionIdsRef.current.add(sessionId);
			try {
				track(CLARITY_ACTION_ID.SESSION.FEEDBACK_BUTTON_VIEW);
			} catch {
				// 분석 이벤트가 실패해도 세션 목록 이용을 방해하지 않는다.
			}
		},
		[track],
	);

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
			itemContent={(_, session) => (
				<SessionItem key={session.id} session={session} onFeedbackView={handleFeedbackView} />
			)}
			className="scrollbar-hide flex-1"
		/>
	);
};

function SessionItem({
	session,
	onFeedbackView,
}: {
	session: SessionListItem;
	onFeedbackView: (sessionId: number) => void;
}) {
	const { track } = useClarity();
	const handleView = useCallback(() => onFeedbackView(session.id), [onFeedbackView, session.id]);
	const feedbackRef = useFeedbackImpression<HTMLAnchorElement>(
		Boolean(session.feedback?.canSubmit),
		handleView,
	);
	const feedbackDaysRemaining = session.feedback
		? getFeedbackDaysRemaining(session.feedback.endAt)
		: null;
	const feedbackSearchParams = '?returnTo=%2Fsession&source=session';

	return (
		<div className="px-4">
			<div className="flex flex-col gap-2.5 border-line-subtle border-b px-3 py-4">
				<Button
					size="none"
					variant="none"
					className="flex w-full cursor-pointer flex-col items-start text-left"
					asChild
				>
					<Link href={`/session/${session.id}?returnTo=%2Fsession`}>
						<div className="flex w-full flex-col gap-1.5">
							<div className="flex flex-col gap-0.5">
								<p className="font-medium text-caption1 text-label-assistive">
									{formatSessionWeekString(session.week)}
								</p>
								<h3 className="font-semibold text-body1 text-label-normal">{session.name}</h3>
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
						<Link
							ref={feedbackRef}
							href={`/session/${session.id}/feedback${feedbackSearchParams}`}
							onClick={() => {
								try {
									track(CLARITY_ACTION_ID.SESSION.FEEDBACK_BUTTON_CLICK);
								} catch {
									// 분석 이벤트가 실패해도 링크 이동을 방해하지 않는다.
								}
							}}
						>
							피드백 남기기 (D-{feedbackDaysRemaining})
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}

// 기수 종료 등으로 read:session 권한이 없으면 서버가 403을 내려준다.
const SessionListErrorFallback = ({ error, reset }: ErrorBoundaryFallbackProps) => {
	if (error instanceof HTTPError && error.response.status === 403) {
		return (
			<Empty className="h-full min-h-41.5">
				<EmptyHeader>
					<Aesterisk />
					<EmptyTitle>활동이 종료되어 세션을 확인할 수 없어요</EmptyTitle>
				</EmptyHeader>
			</Empty>
		);
	}

	return <ErrorBox onReset={reset} />;
};

export const SessionList = () => {
	return (
		<ErrorBoundary fallback={SessionListErrorFallback}>
			<Suspense fallback={<LoadingBox />}>
				<SessionListContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
