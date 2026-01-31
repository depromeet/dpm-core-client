'use client';

import { useState } from 'react';
import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { StaffTogetherList } from './_components/staff-together-list';
import {
	StaffTogetherBanner,
	StaffTogetherBannerContainer,
} from './_components/staff-together-list-banner';
import {
	StaffTogetherStatusList,
	type StaffTogetherStatusType,
} from './_components/staff-together-list-status';

const StaffTogetherPage = () => {
	const [selectedStatus, setSelectedStatus] = useState<StaffTogetherStatusType>('ALL');

	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="staff-together" />
			<AppHeader title="회식" className="mb-1.5" />
			<StaffTogetherStatusList selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
			<StaffTogetherBannerContainer Banner={<StaffTogetherBanner />} />
			<StaffTogetherList filter={selectedStatus} />
		</AppLayout>
	);
};

export default StaffTogetherPage;
