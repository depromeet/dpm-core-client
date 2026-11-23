'use client';

import type { MemberApprovalStatus } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

import { APPROVAL_TABS } from '../_constants';

interface MemberApprovalTabsProps {
	value: MemberApprovalStatus;
	onChange: (value: MemberApprovalStatus) => void;
}

export const MemberApprovalTabs = ({ value, onChange }: MemberApprovalTabsProps) => {
	return (
		<div role="tablist" className="flex w-full border-b border-line-normal">
			{APPROVAL_TABS.map((tab) => {
				const isActive = tab.value === value;

				return (
					<button
						key={tab.value}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(tab.value)}
						className={cn(
							'flex h-11.5 w-30 cursor-pointer items-center justify-center text-title2 font-bold transition-colors',
							isActive
								? 'border-b-2 border-gray-900 text-label-normal'
								: 'text-label-assistive hover:text-label-subtle',
						)}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
};
