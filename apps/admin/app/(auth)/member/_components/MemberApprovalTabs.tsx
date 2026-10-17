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
		<div role="tablist" className="flex w-full border-line-normal border-b">
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
							'cursor-pointer px-4 py-3 font-semibold text-body1 transition-colors',
							isActive
								? 'border-label-normal border-b-2 text-label-normal'
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
