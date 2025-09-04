import { AppHeader } from '@/components/app-header';
import { DoneContainer } from './_components/done-container';
import { FloatingButtonContainer } from './_components/floating-button-container';

interface CreateBillsDonePageProps {
	params: Promise<{ billId: string }>;
}

export default async function CreateBillsDonePage({ params }: CreateBillsDonePageProps) {
	const { billId } = await params;

	return (
		<>
			<AppHeader title="정산서" className="sticky top-0 bg-gray-0 z-10" />
			<DoneContainer billId={Number(billId)} />
			<FloatingButtonContainer billId={Number(billId)} />
		</>
	);
}
