import { AppLayout, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { Section } from '@/components/section';

import { SessionList } from './_components/session-list';
import { SessionPageTracker } from './_components/session-page-tracker';

const SessionDefault = () => {
	return (
		<AppLayout className="min-h-dvh bg-background-normal">
			<GAPageTracker type="session" />
			<SessionPageTracker />

			<AppHeader title="세션" className="mb-1.5" />
			<Section>
				<SessionList />
			</Section>
		</AppLayout>
	);
};

export default SessionDefault;
