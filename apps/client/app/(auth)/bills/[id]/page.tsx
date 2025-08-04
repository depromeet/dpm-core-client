import { AppHeader } from '@/components/app-header';
import { BillDetail } from './_components/bill-detail';

const BillDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	return (
		<>
			<AppHeader title="회식 참석 조사" backHref="/bills" className="mb-1.5" />
			<BillDetail billId={Number(id)} />
		</>
	);
};

export default BillDetailPage;
