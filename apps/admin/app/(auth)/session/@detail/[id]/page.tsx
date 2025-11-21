import { SheetHeader, SheetTitle } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { Section } from '@/components/section';

import SessionDetailInfo from '../_components/session-detail-info';
import { RightSheet } from './_components/right-sheet';

const SessionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	return (
		<RightSheet>
			<AppHeader title="세션 상세" className="md:hidden" />
			<SheetHeader className="sr-only">
				<SheetTitle>세션 상세</SheetTitle>
			</SheetHeader>
			<Section>
				<SessionDetailInfo sessionId={id} />
			</Section>
		</RightSheet>
	);
};

export default SessionDetailPage;
