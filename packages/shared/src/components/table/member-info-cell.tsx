'use client';

import { cn } from '../../utils/cn';
import { MemberProfile, type MemberProfileProps } from '../member-profile';

export interface MemberInfoCellProps extends MemberProfileProps {
	isHeader?: boolean;
}

export const MemberInfoCell = ({ className, isHeader = false, ...props }: MemberInfoCellProps) => {
	if (isHeader) {
		return (
			<div className={cn('flex h-14 items-center bg-background-strong px-3', className)}>
				<p className="text-body2 font-medium text-label-subtle">멤버 정보</p>
			</div>
		);
	}

	return (
		<div className={cn('flex items-center gap-2.5 p-3', className)}>
			<MemberProfile {...props} showHover={false} className="p-0" />
		</div>
	);
};
