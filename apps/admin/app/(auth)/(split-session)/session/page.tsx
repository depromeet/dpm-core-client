import { GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { SessionList } from './_components/SessionList';
import { SessionMobileGuard } from './_components/SessionMobileGuard';
import { SessionPageTracker } from './_components/SessionPageTracker';

const SessionPage = () => {
	return (
		<SessionMobileGuard>
			<GAPageTracker type="session" />
			<SessionPageTracker />
			<AppHeader title="세션" className="px-0 md:hidden" />
			<SessionList />
		</SessionMobileGuard>
	);
};

export default SessionPage;
