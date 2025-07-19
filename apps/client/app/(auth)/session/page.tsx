import { AppHeader } from '@/components/app-header';
import { AppLayout } from '@/layout/app-layout';
import { SessionList } from './_components/session-list';

const SessionPage = () => {
	return (
		<AppLayout className="bg-background-normal ">
			<AppHeader title="세션" backHref="/" className="mb-1.5" />

			<SessionList />
		</AppLayout>
	);
};

export default SessionPage;
