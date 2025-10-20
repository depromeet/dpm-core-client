'use client';

import Link from 'next/link';
import { redirect, useSelectedLayoutSegment } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@dpm-core/shared';

import { SESSION_ID } from '../const/const';

const CONST_TABS = [
	{ value: 'session', label: '세션별' },
	{ value: 'people', label: '사람별' },
];

export const AttendanceTabs = () => {
	const tab = useSelectedLayoutSegment();

	if (!tab || !CONST_TABS.some(({ value }) => value === tab)) {
		redirect(`/attendance/search/session?week=${SESSION_ID}`);
	}

	return (
		<Tabs value={tab}>
			<TabsList className="px-4">
				{CONST_TABS.map(({ value, label }) => {
					return (
						<TabsTrigger key={value} value={value} asChild>
							<Link
								href={`/attendance/search/${value === 'session' ? `session?week=${SESSION_ID}` : value}`}
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
