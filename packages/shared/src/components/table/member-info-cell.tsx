'use client';

import type React from 'react';
import { MemberProfile, type MemberProfileProps } from '../member-profile';
import { cn } from '../../utils/cn';

export interface MemberInfoCellProps extends MemberProfileProps {
	isHeader?: boolean;
}

export const MemberInfoCell = ({ className, isHeader = false, ...props }: MemberInfoCellProps) => {
	if (isHeader) {
		return (
			<div className={cn('flex h-14 items-center px-3 bg-background-strong', className)}>
				<p className="font-medium text-body2 text-label-subtle">멤버 정보</p>
			</div>
		);
	}

	return (
		<div className={cn('flex items-center gap-2.5 p-3', className)}>
			<MemberProfile {...props} showHover={false} className="p-0" />
		</div>
	);
};
