import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { AdminAfterPartyDetail } from './_components/admin-after-party-detail';

export default async function AfterPartyDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<AppLayout className="bg-background-normal">
			<AppHeader title="회식 상세" className="mb-0" />
			<AdminAfterPartyDetail afterPartyId={Number(id)} />
		</AppLayout>
	);
}
