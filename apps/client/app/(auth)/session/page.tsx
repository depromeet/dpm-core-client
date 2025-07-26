import { AppLayout } from '@dpm-core/shared';
import { AppHeader } from '@/components/app-header';
import { SessionList } from './_components/session-list';

const SessionPage = () => {
	return (
		<AppLayout className="bg-background-normal ">
			<AppHeader title="세션" className="mb-1.5" />

			<SessionList />
		</AppLayout>
	);
};

export default SessionPage;
