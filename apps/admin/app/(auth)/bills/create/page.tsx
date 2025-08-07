import { AppHeader } from '@/components/app-header';
import { BillForm } from './_components/bill-form';

export default function CreateBillsPage() {
	return (
		<>
			<AppHeader title="정산 만들기" className="sticky top-0 bg-gray-0 z-10" />
			<BillForm />
		</>
	);
}
