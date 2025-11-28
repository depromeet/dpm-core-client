'use client';

import Link from 'next/link';
import { redirect, useSelectedLayoutSegment } from 'next/navigation';
import { cn, Tabs, TabsList, TabsTrigger } from '@dpm-core/shared';

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
		<>
			{/* Mobile view (< 768px */}
			<Tabs value={tab} className="md:hidden">
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

			{/* Desktop view (>= 768px) */}
			<nav
				className={cn(
					'hidden w-full bg-white md:mx-auto md:block',
					tab === 'people' && 'border-line-normal border-b',
				)}
			>
				<div className="mx-auto flex h-20 w-full max-w-[1200px] items-center gap-5 px-10">
					{CONST_TABS.map(({ value, label }) => {
						const isActive = tab === value;
						return (
							<Link
								key={value}
								href={`/attendance/search/${value === 'session' ? `session?week=${SESSION_ID}` : value}`}
								replace
								className={cn(
									'whitespace-nowrap font-bold text-headline1 tracking-[-0.48px]',
									isActive ? 'text-label-normal' : 'text-label-assistive',
								)}
							>
								{label}
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
};
