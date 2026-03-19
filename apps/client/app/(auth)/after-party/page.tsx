'use client';

import { GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { BottomTabBar } from '@/components/bottom-tab-bar';
import { useAuth } from '@/providers/auth-provider';

import { AfterPartyAddButton } from './_components/after-party-add-button';
import { AfterPartyList } from './_components/after-party-list';
import { AfterPartyBanner, AfterPartyBannerContainer } from './_components/after-party-list-banner';
import { AfterPartyStatusFilter } from './_components/after-party-list-filter';

const AfterPartyPage = () => {
	const { user } = useAuth();

	return (
		<SafeAreaAppLayout
			hasBottomTabBar
			className="relative h-dvh overflow-hidden bg-background-normal"
		>
			<GAPageTracker type="after-party" />
			<AppHeader title="회식" className="mb-1.5" />
			<AfterPartyStatusFilter />
			<AfterPartyBannerContainer Banner={<AfterPartyBanner />} />
			<AfterPartyList />
			<BottomTabBar />
			{user?.isAdmin && <AfterPartyAddButton />}
		</SafeAreaAppLayout>
	);
};

export default AfterPartyPage;
