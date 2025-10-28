import { AppHeader } from '@/components/app-header';

import { BillLsit } from './_components/bill-list';

export default function SettleMainPage() {
	return (
		<>
			<AppHeader title="정산" backHref="/" className="mb-1.5" />
			<BillLsit />
		</>
	);
}
