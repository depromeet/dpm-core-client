import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { SuperAdminTabs } from './_components/SuperAdminTabs';

export default function SuperAdminPage() {
	return (
		<AppLayout className="flex flex-col bg-background-normal">
			<AppHeader title="Super Admin" />
			<SuperAdminTabs />
		</AppLayout>
	);
}
