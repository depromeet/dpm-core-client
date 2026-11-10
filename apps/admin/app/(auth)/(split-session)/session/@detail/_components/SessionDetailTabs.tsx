'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@dpm-core/shared';

import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useClarity } from '@/providers/admin-clarity-adapter';
import { getSessionDetailQuery } from '@/remotes/queries/session';

import { getInsightClarityTracker } from './insight-clarity-tracker';
import { SessionDetailInfo } from './SessionDetailInfo';
import { SessionFeedbackInsights } from './SessionFeedbackInsights';

interface SessionDetailTabsProps {
	sessionId: number;
}

export const SessionDetailTabs = ({ sessionId }: SessionDetailTabsProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: sessionDetailResponse } = useQuery(getSessionDetailQuery(sessionId));
	const hasFeedback = Boolean(sessionDetailResponse?.data.feedback);
	const activeTab = hasFeedback && searchParams.get('tab') === 'feedback' ? 'feedback' : 'info';
	const { track } = useClarity();
	const queryClient = useQueryClient();
	const insightTracker =
		activeTab === 'feedback' ? getInsightClarityTracker(queryClient, sessionId, track) : null;
	const viewedSessionIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!insightTracker) {
			viewedSessionIdRef.current = null;
			return;
		}
		if (viewedSessionIdRef.current !== sessionId) {
			viewedSessionIdRef.current = sessionId;
			try {
				track(CLARITY_ACTION_ID.SESSION_DETAIL.INSIGHT_TAB_VIEW);
			} catch {
				// 분석 이벤트가 실패해도 탭을 표시한다.
			}
		}
		insightTracker.activate();
		return () => insightTracker.release();
	}, [insightTracker, sessionId, track]);

	const handleTabChange = (tab: string) => {
		if (tab === 'feedback' && !hasFeedback) return;

		const nextSearchParams = new URLSearchParams(searchParams.toString());
		if (tab === 'feedback') {
			nextSearchParams.set('tab', tab);
		} else {
			nextSearchParams.delete('tab');
		}

		const query = nextSearchParams.toString();
		router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
	};

	return (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			className="flex min-h-0 flex-1 flex-col"
		>
			<TabsList className="mt-3 h-12 w-full shrink-0 justify-start border-line-subtle border-b px-10">
				<TabsTrigger value="info" className="w-[68px] flex-none px-5 text-body2">
					정보
				</TabsTrigger>
				{hasFeedback && (
					<TabsTrigger value="feedback" className="w-[82px] flex-none px-5 text-body2">
						피드백
					</TabsTrigger>
				)}
			</TabsList>
			<TabsContent value="info" className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-10">
				<SessionDetailInfo sessionId={sessionId} />
			</TabsContent>
			{hasFeedback && (
				<TabsContent value="feedback" className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-10">
					{insightTracker && (
						<SessionFeedbackInsights sessionId={sessionId} insightTracker={insightTracker} />
					)}
				</TabsContent>
			)}
		</Tabs>
	);
};
