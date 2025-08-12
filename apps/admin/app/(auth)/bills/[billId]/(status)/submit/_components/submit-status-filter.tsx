'use client';

import { Tabs, TabsList, TabsTrigger } from '@dpm-core/shared';

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
	return (
		<Tabs>
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
