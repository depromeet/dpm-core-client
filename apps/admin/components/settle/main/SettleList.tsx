'use client';

import type { Bill } from '@dpm-core/api';
import { useSettleFilterStore } from '@/store/useSettleFilterStore';
import SettleListItem from './SettleListItem';

interface SettleListProps {
	settleList: Bill[];
}

const SettleList = ({ settleList }: SettleListProps) => {
	const filter = useSettleFilterStore((state) => state.filter);

	const filteredList = settleList.filter((bill) => {
		if (filter === 'ALL') return true;
		return bill.billStatus === filter;
	});

	return (
		<ul className="flex flex-col">
			{filteredList.map((bill) => (
				<SettleListItem key={bill.billId} bill={bill} />
			))}
		</ul>
	);
};

export default SettleList;
