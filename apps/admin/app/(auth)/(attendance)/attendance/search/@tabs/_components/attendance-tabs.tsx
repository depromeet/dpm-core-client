'use client';

import { Tabs, TabsList, TabsTrigger } from '@dpm-core/shared';
import Link from 'next/link';
import { redirect, useSelectedLayoutSegment } from 'next/navigation';

const CONST_TABS = [
	{ value: 'session', label: '세션별' },
	{ value: 'people', label: '사람별' },
];

export const AttendanceTabs = () => {
	const tab = useSelectedLayoutSegment();

	if (!tab || !CONST_TABS.some(({ value }) => value === tab)) {
		redirect('/attendance/search/session?week=2');
	}

	return (
		<Tabs value={tab}>
			<TabsList className="px-4">
				{CONST_TABS.map(({ value, label }) => {
					return (
						<TabsTrigger key={value} value={value} asChild>
							<Link
								href={`/attendance/search/${value === 'session' ? 'session?week=2' : value}`}
								replace
							>
								{label}
							</Link>
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
};
