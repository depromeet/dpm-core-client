import { BillGatheringContainer } from './_components/bill-gathering-container';

interface Props {
	params: Promise<{ gatheringId: string }>;
}
export default async function BillsDetailPage({ params }: Props) {
	const { gatheringId } = await params;

	return <BillGatheringContainer gatheringId={Number(gatheringId)} />;
}
