'use client';

import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { AfterPartyBanner, AfterPartyBannerContainer } from './_components/after-party-list-banner';
import { AfterPartyStatusFilter } from './_components/after-party-list-filter';
import { AfterPartyList } from './_components/after-pary-list';

const AfterPartyPage = () => {
	// const [selectedStatus, setSelectedStatus] = useState<AfterPartyStatusType>('ALL');

	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="after-party" />
			<AppHeader title="회식" className="mb-1.5" />
			<AfterPartyStatusFilter />
			<AfterPartyBannerContainer Banner={<AfterPartyBanner />} />
			<AfterPartyList />
		</AppLayout>
	);
};

export default AfterPartyPage;
