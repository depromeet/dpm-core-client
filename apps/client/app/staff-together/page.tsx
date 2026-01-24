import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { StaffTogetherStatusList } from './_components/staff-together-list-status';

// import { SessionList } from './_components/session-list';
// import { SessionPageTracker } from './_components/session-page-tracker';

const StaggTogetherPage = () => {
	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="staff-together" />
			{/* <SessionPageTracker /> */}

			<AppHeader title="회식" className="mb-1.5" />

			<StaffTogetherStatusList />

			{/* <SessionList /> */}
		</AppLayout>
	);
};

export default StaggTogetherPage;
