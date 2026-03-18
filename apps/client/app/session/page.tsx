import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { BottomTabBar } from '@/components/bottom-tab-bar';

import { SessionList } from './_components/session-list';
import { SessionPageTracker } from './_components/session-page-tracker';

export default function SessionPage() {
	return (
		<AppLayout className="h-dvh bg-background-normal">
			<GAPageTracker type="session" />
			<SessionPageTracker />
			<AppHeader title="세션" className="mb-1.5" />
			<SessionList />
			<BottomTabBar />
		</AppLayout>
	);
}
