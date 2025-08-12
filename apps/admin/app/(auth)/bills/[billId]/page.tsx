import { BillDetailContainer } from './_components/bill-detail-container';

interface Props {
	params: Promise<{ billId: string }>;
}
export default async function BillsDetailPage({ params }: Props) {
	const { billId } = await params;

	return <BillDetailContainer billId={Number(billId)} />;
}
