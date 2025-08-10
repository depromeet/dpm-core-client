import { BillDetail } from './_components/bill-detail';

const BillDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	return <BillDetail billId={Number(id)} />;
};

export default BillDetailPage;
