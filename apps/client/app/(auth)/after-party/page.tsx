'use client';

import { useState } from 'react';
import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { AfterPartyBanner, AfterPartyBannerContainer } from './_components/after-party-list-banner';
import { AfterPartyList } from './_components/after-pary-list';
import {
	AfterPartyStatusList,
	type AfterPartyStatusType,
} from './_components/after-pary-list-status';

const AfterPartyPage = () => {
	const [selectedStatus, setSelectedStatus] = useState<AfterPartyStatusType>('ALL');

	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="staff-together" />
			<AppHeader title="회식" className="mb-1.5" />
			<AfterPartyStatusList selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
			<AfterPartyBannerContainer Banner={<AfterPartyBanner />} />
			<AfterPartyList filter={selectedStatus} />
		</AppLayout>
	);
};

export default AfterPartyPage;
