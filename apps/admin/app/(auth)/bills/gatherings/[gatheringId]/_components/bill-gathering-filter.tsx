'use client';

import { Tabs, TabsList, TabsTrigger } from '@dpm-core/shared';
import { useGatheringStatusSearchParams } from '../_hooks/use-gathering-status-search-params';
import { ATTEND_STATUS } from '../const/attend-status';

const TABS_FILTER = [
	{
		label: '제출 전체',
		value: ATTEND_STATUS.ALL,
	},
	{
		label: '참석함',
		value: ATTEND_STATUS.ATTEND,
	},
	{
		label: '참석 안함',
		value: ATTEND_STATUS.ABSENT,
	},
];

export const BillGatheringFilter = () => {
	const { attendStatus, handleChange } = useGatheringStatusSearchParams();

	return (
		<Tabs value={attendStatus} onValueChange={handleChange}>
			<TabsList className="pt-2 px-4">
				{TABS_FILTER.map(({ value, label }) => {
					return (
						<TabsTrigger key={value} value={value} className="data-[state=active]:border-gray-900 ">
							{label}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
};
