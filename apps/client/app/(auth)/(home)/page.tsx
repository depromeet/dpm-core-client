import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { BottomTabBar } from '@/components/bottom-tab-bar';

import { HomeCheckAttendanceBanner } from './_components/home-attendance-banner';
import { HomeBannerList } from './_components/home-banner-list';
import { HomeHeader } from './_components/home-header';
import { UserActionList } from './_components/user-action-list';

export default function HomePage() {
	return (
		<AppLayout className="h-dvh">
			<GAPageTracker type="home" />
			<HomeHeader />
			<main className="scrollbar-hide flex-1 overflow-auto">
				<HomeCheckAttendanceBanner />
				<HomeBannerList />
				<UserActionList />
			</main>
			<BottomTabBar />
		</AppLayout>
	);
}
