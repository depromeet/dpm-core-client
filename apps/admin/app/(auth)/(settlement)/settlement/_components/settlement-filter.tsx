'use client';

import { SettlementTypeFilter, SettlementTypeFilterItem } from './settlement-type-filter';

const SettlementFilter = () => {
	return (
		<SettlementTypeFilter onChange={console.log} className="flex gap-x-2" defaultValue="1">
			<SettlementTypeFilterItem label="전체" value="1" />
			<SettlementTypeFilterItem label="멤버 확정 전" value="2" />
			<SettlementTypeFilterItem label="정산 중" value="3" />
			<SettlementTypeFilterItem label="정산 끝" value="4" />
		</SettlementTypeFilter>
	);
};

export { SettlementFilter };
