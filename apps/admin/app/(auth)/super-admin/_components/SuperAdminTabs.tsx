'use client';

import { useState } from 'react';
import { cn } from '@dpm-core/shared';

import { CohortManagement } from './CohortManagement';
import { PermissionManagement } from './PermissionManagement';
import { UserHardDelete } from './UserHardDelete';

const TABS = [
	{ key: 'cohort', label: '기수 관리' },
	{ key: 'permission', label: '권한 관리' },
	{ key: 'user-delete', label: '유저 삭제' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export const SuperAdminTabs = () => {
	const [activeTab, setActiveTab] = useState<TabKey>('cohort');

	return (
		<div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 px-4 pt-8 md:px-10">
			{/* Tab Headers */}
			<div className="flex w-full border-line-normal border-b">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						type="button"
						className={cn(
							'cursor-pointer px-4 py-3 font-semibold text-body1 transition-colors',
							activeTab === tab.key
								? 'border-label-normal border-b-2 text-label-normal'
								: 'text-label-assistive hover:text-label-subtle',
						)}
						onClick={() => setActiveTab(tab.key)}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			{activeTab === 'cohort' && <CohortManagement />}
			{activeTab === 'permission' && <PermissionManagement />}
			{activeTab === 'user-delete' && <UserHardDelete />}
		</div>
	);
};
