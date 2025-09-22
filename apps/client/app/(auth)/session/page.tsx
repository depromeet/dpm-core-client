import { AppLayout, GAPageTracker, gaTrackSessionEnter } from '@dpm-core/shared';
import { AppHeader } from '@/components/app-header';
import { SessionList } from './_components/session-list';
import { SessionPageTracker } from './_components/session-page-tracker';

const SessionPage = () => {
	return (
		<AppLayout className="bg-background-normal ">
			<GAPageTracker type="session" />
			<SessionPageTracker />
			<AppHeader title="세션" className="mb-1.5" />

			<SessionList />
		</AppLayout>
	);
};

export default SessionPage;
