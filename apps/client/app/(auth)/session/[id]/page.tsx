import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { SessionDetailBackButton } from './_components/session-detail-back-button';
import { SessionDetailInfo } from './_components/session-detail-info';

export default async function SessionDetailPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
	const { id } = await params;
	const { returnTo } = await searchParams;
	const safeReturnTo = returnTo === '/' ? '/' : '/session';

	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader
				title="세션 정보"
				className="mb-4"
				leftIcon={<SessionDetailBackButton returnTo={safeReturnTo} />}
			/>
			<SessionDetailInfo sessionId={Number(id)} />
		</SafeAreaAppLayout>
	);
}
