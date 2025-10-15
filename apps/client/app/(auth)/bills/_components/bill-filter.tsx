'use client';

import { useBillStatusSearchParams } from '../_hooks/use-bill-status-search-params';
import { BillTypeFilter, BillTypeFilterItem } from './bill-type-filter';

const BillFilter = () => {
	const { billStatus, handleChange } = useBillStatusSearchParams();

	return (
		<BillTypeFilter
			onChange={(filterValue) => handleChange(filterValue)}
			className="flex gap-x-2 px-4 py-2.5"
			value={billStatus}
		>
			<BillTypeFilterItem label="전체" value="ALL" />
			<BillTypeFilterItem label="멤버 확정 전" value="OPEN" />
			<BillTypeFilterItem label="정산 중" value="IN_PROGRESS" />
			<BillTypeFilterItem label="정산 끝" value="COMPLETED" />
		</BillTypeFilter>
	);
};

export { BillFilter };
