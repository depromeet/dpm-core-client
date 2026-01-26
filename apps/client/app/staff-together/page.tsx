import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { StaffTogetherBanner } from './_components/staff-together-list-banner';
import { StaffTogetherStatusList } from './_components/staff-together-list-status';
import { StaffTogetherList } from './_components/staff-together-list';

// import { SessionList } from './_components/session-list';
// import { SessionPageTracker } from './_components/session-page-tracker';

const StaggTogetherPage = () => {
	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="staff-together" />
			{/* <SessionPageTracker /> */}

			<AppHeader title="회식" className="mb-1.5" />

			<StaffTogetherStatusList />
			<div className="px-[16px] py-[8px]">
				<StaffTogetherBanner />
			</div>

			<StaffTogetherList />
			{/* <SessionList /> */}
		</AppLayout>
	);
};

export default StaggTogetherPage;
