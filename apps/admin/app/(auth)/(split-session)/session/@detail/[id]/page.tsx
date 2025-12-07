import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { SessionCloseModalButton } from '../_components/SessionCloseModalButton';
import { SessionDetailInfo } from '../_components/SessionDetailInfo';
import { SessionDropDownMenu } from '../_components/SessionDropDownMenu';

const SessionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	return (
		<Sheet modal={false} open={!!id}>
			<SheetContent className="w-full min-w-full gap-0 border-line-normal shadow-none outline-none md:w-[600px] md:min-w-[600px]">
				<SheetHeader className="flex-row items-center justify-between border-gray-200 border-b px-10 py-6 max-md:hidden">
					<SheetTitle className="font-bold text-headline1 text-label-normal">세션 상세</SheetTitle>
					<SheetClose asChild>
						<SessionCloseModalButton />
					</SheetClose>
				</SheetHeader>
				<AppHeader
					title="세션 정보"
					className="md:hidden"
					rightIcon={<SessionDropDownMenu sessionId={Number(id)} />}
				/>
				<SessionDetailInfo sessionId={Number(id)} />
			</SheetContent>
		</Sheet>
	);
};

export default SessionDetailPage;
