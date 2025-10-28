import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { Section } from '@/components/section';

import SessionDetailInfo from '../_components/session-detail-info';

const SessionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	return (
		<>
			<AppHeader title="세션 상세" className="md:hidden" />
			<Sheet modal={false} defaultOpen={!!id}>
				<SheetContent className="w-full min-w-full border-line-normal shadow-none md:w-[600px] md:min-w-[600px] md:pt-[81px]">
					<SheetHeader className="sr-only">
						<SheetTitle>세션 상세</SheetTitle>
					</SheetHeader>
					<Section>
						<SessionDetailInfo sessionId={id} />
					</Section>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default SessionDetailPage;
