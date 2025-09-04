import { AppHeader } from '@/components/app-header';
import { BillList } from './_components/bill-list';

export default function BillsMainPage() {
	return (
		<>
			<AppHeader title="정산" className="mb-1.5" />
			<BillList />
		</>
	);
}
