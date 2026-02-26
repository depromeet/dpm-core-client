import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { NonParticipantsNotification } from '../_components/admin/non-participants-notification';
import { AfterPartyParticipantsFilter } from './_components/after-party-participants-filter';
import { AfterPartyParticipantsList } from './_components/after-party-participants-list';

export default async function AfterPartyParticipantsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<AppLayout className="h-dvh bg-background-normal">
			<AppHeader title="제출 현황" className="mb-0" />
			<section className="px-4 py-3">
				<AfterPartyParticipantsFilter />
			</section>
			<section className="mb-20 flex-1">
				<AfterPartyParticipantsList afterPartyId={Number(id)} />
			</section>
			<section className="fixed bottom-0 w-full max-w-lg px-4 py-8">
				<NonParticipantsNotification size="lg" />
			</section>
		</AppLayout>
	);
}
