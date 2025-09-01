import { AppHeader } from '@/components/app-header';
import { DoneContainer } from './_components/done-container';
import { FloatingButtonContainer } from './_components/floating-button-cotainer';

interface Props {
	params: Promise<{ billId: string }>;
}
export default async function BillStatusDonePage({ params }: Props) {
	const { billId } = await params;

	return (
		<>
			<AppHeader title="최종 정산서" className="sticky top-0 bg-gray-0 z-10" />
			<DoneContainer billId={Number(billId)} />
			<FloatingButtonContainer billId={Number(billId)} />
		</>
	);
}
