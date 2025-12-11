import { GAPageTracker } from '@dpm-core/shared';

import { Section } from '@/components/section';

import { SessionList } from './_components/SessionList';
import { SessionMobileGuard } from './_components/SessionMobileGuard';
import { SessionPageTracker } from './_components/SessionPageTracker';

const SessionPage = () => {
	return (
		<SessionMobileGuard>
			<GAPageTracker type="session" />
			<SessionPageTracker />
			<Section className="h-full">
				<SessionList />
			</Section>
		</SessionMobileGuard>
	);
};

export default SessionPage;
