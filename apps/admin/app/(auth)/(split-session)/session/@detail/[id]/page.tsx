import { SheetClose, SheetHeader, SheetTitle } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { SessionDetailInfo } from '../_components/SessionDetailInfo';
import { SessionDropDownMenu } from '../_components/SessionDropDownMenu';
import { SessionSheetCloseButton } from '../_components/SessionSheet';

const SessionDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	return (
		<>
			<SheetHeader className="flex-row items-center justify-between border-gray-200 border-b px-10 py-6 max-md:hidden">
				<SheetTitle className="font-bold text-headline1 text-label-normal">세션 상세</SheetTitle>
				<SheetClose asChild>
					<SessionSheetCloseButton />
				</SheetClose>
			</SheetHeader>
			<AppHeader
				title="세션 정보"
				className="md:hidden"
				rightIcon={<SessionDropDownMenu sessionId={Number(id)} />}
			/>
			<SessionDetailInfo sessionId={Number(id)} />
		</>
	);
};

export default SessionDetailPage;
