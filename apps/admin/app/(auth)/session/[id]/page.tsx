import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import SessionDetailInfo from './_components/session-detail-info';

const SessionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	return (
		<AppLayout className="bg-background-normal">
			<AppHeader title="세션 상세" />
			<SessionDetailInfo sessionId={id} />
		</AppLayout>
	);
};

export default SessionDetailPage;
