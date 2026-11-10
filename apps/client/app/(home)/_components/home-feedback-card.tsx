'use client';

import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useFeedbackImpression } from '@/hooks/use-feedback-impression';
import { getFeedbackDaysRemaining } from '@/lib/session/feedback';
import { useClarity } from '@/providers/client-clarity-adapter';
import { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

interface HomeFeedbackCardProps {
	isAttendanceOpen: boolean;
}

export const HomeFeedbackCard = ({ isAttendanceOpen }: HomeFeedbackCardProps) => {
	const { data } = useQuery(getMyPendingSessionFeedbackQuery());
	const pendingFeedback = data?.data;
	const sessionId = pendingFeedback?.sessionId;
	const { track } = useClarity();
	const viewedSessionIdRef = useRef<number | null>(null);
	const handleView = useCallback(() => {
		if (sessionId === undefined || Object.is(viewedSessionIdRef.current, sessionId)) return;
		viewedSessionIdRef.current = sessionId;
		try {
			track(CLARITY_ACTION_ID.HOME.FEEDBACK_CARD_VIEW);
		} catch {
			// 분석 이벤트가 실패해도 홈 화면 이용을 방해하지 않는다.
		}
	}, [sessionId, track]);
	const cardRef = useFeedbackImpression<HTMLDivElement>(
		Boolean(pendingFeedback) && !isAttendanceOpen,
		handleView,
	);

	if (!pendingFeedback || isAttendanceOpen) return null;

	const daysRemaining = getFeedbackDaysRemaining(pendingFeedback.endAt);
	return (
		<div
			ref={cardRef}
			className="flex h-[150px] flex-col gap-4 rounded-[10px] border border-white bg-background-normal p-4 shadow-[0_0_10px_rgba(0,0,0,0.04)]"
		>
			<div className="flex flex-col gap-1">
				<p className="font-medium text-caption1 text-label-assistive">
					{pendingFeedback.week}주차 세션
				</p>
				<h2 className="truncate font-semibold text-body1 text-label-normal">
					{pendingFeedback.sessionName}
				</h2>
				<p className="font-medium text-caption1 text-label-assistive">
					좋았던 점이나 아쉬웠던 점을 알려주세요.
				</p>
			</div>
			<Link
				className="flex h-10 shrink-0 items-center justify-center rounded-lg bg-background-inverse font-semibold text-caption1 text-label-inverse"
				href={`/session/${pendingFeedback.sessionId}/feedback?returnTo=%2F&source=home`}
				onClick={() => {
					try {
						track(CLARITY_ACTION_ID.HOME.FEEDBACK_BUTTON_CLICK);
					} catch {
						// 분석 이벤트가 실패해도 링크 이동을 방해하지 않는다.
					}
				}}
			>
				피드백 남기기 (D-{daysRemaining})
			</Link>
		</div>
	);
};
