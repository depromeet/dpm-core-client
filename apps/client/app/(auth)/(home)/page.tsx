import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { HomeMenu } from './_components/home-menu';
import { HomeNavbar } from './_components/home-navbar';
import { SessionCurrentWeekBanner } from './_components/session-top-banner';
import { VocBanner } from './_components/voc-banner';

const UserPage = () => {
	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="home" />
			<HomeNavbar />
			<SessionCurrentWeekBanner />
			<HomeMenu />
			<VocBanner />
		</AppLayout>
	);
};

export default UserPage;
