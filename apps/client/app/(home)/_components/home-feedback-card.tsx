'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

interface HomeFeedbackCardProps {
	isAttendanceOpen: boolean;
}

export const HomeFeedbackCard = ({ isAttendanceOpen }: HomeFeedbackCardProps) => {
	const { data } = useQuery(getMyPendingSessionFeedbackQuery);
	const pendingFeedback = data?.data;

	if (!pendingFeedback || isAttendanceOpen) return null;

	const daysRemaining = Math.max(
		0,
		Math.ceil(dayjs(pendingFeedback.endAt).diff(dayjs(), 'hour', true) / 24),
	);
	const searchParams =
		process.env.NODE_ENV === 'development'
			? '?mockAuthenticated=true&returnTo=%2F'
			: '?returnTo=%2F';

	return (
		<div className="flex h-[150px] flex-col gap-4 rounded-[10px] border border-white bg-background-normal p-4 shadow-[0_0_10px_rgba(0,0,0,0.04)]">
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
				href={`/session/${pendingFeedback.sessionId}/feedback${searchParams}`}
				className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-background-inverse font-semibold text-caption1 text-label-inverse"
			>
				피드백 남기기 (D-{daysRemaining})
			</Link>
		</div>
	);
};
