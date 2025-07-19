import { AppLayout } from '@dpm-core/shared';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { AppHeader } from '@/components/app-header';
import { getSessionDetailQuery } from '@/remotes/queries/session';
import { getQueryClient } from '@/remotes/query-client';
import SessionDetailInfo from './_components/session-detail-info';

const SessionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const queryClient = getQueryClient();
	await queryClient.fetchQuery(getSessionDetailQuery(Number(id)));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AppLayout className="bg-background-normal">
				<AppHeader title="세션 상세" backHref="/session" />
				<SessionDetailInfo sessionId={id} />
			</AppLayout>
		</HydrationBoundary>
	);
};

export default SessionDetailPage;
