import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { SessionDetailInfo } from './_components/session-detail-info';

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader title="세션 정보" className="mb-4" />
			<SessionDetailInfo sessionId={Number(id)} />
		</SafeAreaAppLayout>
	);
}
