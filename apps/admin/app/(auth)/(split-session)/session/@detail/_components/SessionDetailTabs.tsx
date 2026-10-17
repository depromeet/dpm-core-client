'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@dpm-core/shared';

import { getSessionDetailQuery } from '@/remotes/queries/session';

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
					<SessionFeedbackInsights sessionId={sessionId} />
				</TabsContent>
			)}
		</Tabs>
	);
};
