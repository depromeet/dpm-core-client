'use client';

import { Tabs, TabsList, TabsTrigger } from '@dpm-core/shared';
import { useBillSubmittedStatusSearchParams } from '../_hooks/use-bill-submitted-status-search-params';

const TABS_FILTER = [
	{
		label: '제출',
		value: 'SUBMIT',
	},
	{
		label: '미제출',
		value: 'UNSUBMIT',
	},
];

export const SubmitStatusFilter = () => {
	const { submitStatus, handleChange } = useBillSubmittedStatusSearchParams();

	return (
		<Tabs value={submitStatus} onValueChange={handleChange}>
			<TabsList className="pt-2 px-4">
				{TABS_FILTER.map(({ value, label }) => {
					return (
						<TabsTrigger key={value} value={value} className="data-[state=active]:border-gray-900">
							{label}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
};
