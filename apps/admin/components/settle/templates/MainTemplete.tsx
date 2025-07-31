'use client';

import {
	SettlementTypeFilter,
	SettlementTypeFilterItem,
} from '@/app/(auth)/(settlement)/settlement/_components/settlement-type-filter';
import SettleList from '../main/SettleList';

export default function MainTemplete() {
	return (
		<>
			<SettlementTypeFilter onChange={console.log} className="flex gap-x-2 py-2.5" defaultValue="1">
				<SettlementTypeFilterItem label="전체" value="1" />
				<SettlementTypeFilterItem label="멤버 확정 전" value="2" />
				<SettlementTypeFilterItem label="정산 중" value="3" />
				<SettlementTypeFilterItem label="정산 끝" value="4" />
			</SettlementTypeFilter>
			<SettleList />
			{/* <NoSettle/> */}
		</>
	);
}

{
	/* <CreateSettleBtn /> */
}
