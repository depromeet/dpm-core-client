import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { AfterPartyAttendeesFilter } from './_components/after-party-attendees-filter';
import { AfterPartyAttendeesList } from './_components/after-party-attendees-list';

export default async function AfterPartyAttendeesPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<AppLayout>
			<AppHeader title="참석자" className="mb-0" />
			<section className="px-4 py-3">
				<AfterPartyAttendeesFilter />
			</section>
			<section className="flex-1">
				<AfterPartyAttendeesList afterPartyId={Number(id)} />
			</section>
		</AppLayout>
	);
}
