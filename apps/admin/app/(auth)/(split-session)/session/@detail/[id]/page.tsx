import { AppHeader } from '@/components/app-header';

import { SessionDetailAnimated } from '../_components/SessionDetailAnimated';
import SessionDetailInfo from '../_components/SessionDetailInfo';

const SessionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	return (
		<>
			<AppHeader title="세션 상세" className="px-0 md:hidden" />
			<SessionDetailAnimated id={id}>
				<div className="h-full md:ml-10 md:border-line-normal md:border-l md:pl-10">
					<SessionDetailInfo sessionId={id} />
				</div>
			</SessionDetailAnimated>
		</>
	);
};

export default SessionDetailPage;
