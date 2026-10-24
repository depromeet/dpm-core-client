'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getFeedbackDaysRemaining } from '@/lib/session/feedback';
import { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

interface HomeFeedbackCardProps {
	isAttendanceOpen: boolean;
}

export const HomeFeedbackCard = ({ isAttendanceOpen }: HomeFeedbackCardProps) => {
	const { data } = useQuery(getMyPendingSessionFeedbackQuery());
	const [showPreview, setShowPreview] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setShowPreview(
			window.location.hostname === 'local-core.depromeet.com' &&
			params.get('previewFeedbackCard') === 'true',
		);
	}, []);

	const pendingFeedback = showPreview
		? {
				sessionId: 56,
				week: 2,
				sessionName: '디프만 코어 세션',
				endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
			}
		: data?.data;

	if (!pendingFeedback || (isAttendanceOpen && !showPreview)) return null;

	const daysRemaining = getFeedbackDaysRemaining(pendingFeedback.endAt);
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
				className="flex h-10 shrink-0 items-center justify-center rounded-lg bg-background-inverse font-semibold text-caption1 text-label-inverse"
				href={`/session/${pendingFeedback.sessionId}/feedback?returnTo=%2F`}
			>
				피드백 남기기 (D-{daysRemaining})
			</Link>
		</div>
	);
};
