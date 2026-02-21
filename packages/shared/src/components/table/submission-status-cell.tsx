'use client';

import type React from 'react';
import { Circle, CircleAlert, CircleX } from 'lucide-react';

import { cn } from '../../utils/cn';
import { StatusBadge } from '../status-badge';

type SubmissionStatus = 'pending' | 'not_submitted' | 'late' | 'completed';

const statusConfig = {
	pending: {
		label: '확인 전',
		icon: CircleAlert,
		iconColor: 'text-label-assistive',
	},
	not_submitted: {
		label: '미제출',
		icon: CircleX,
		iconColor: 'text-red-500',
	},
	late: {
		label: '지각 제출',
		icon: Circle,
		iconColor: 'text-yellow-600',
	},
	completed: {
		label: '제출 완료',
		icon: Circle,
		iconColor: 'text-primary-normal',
	},
};

export interface SubmissionStatusCellProps extends React.HTMLAttributes<HTMLDivElement> {
	status?: SubmissionStatus;
	isHeader?: boolean;
}

export const SubmissionStatusCell = ({
	className,
	status = 'pending',
	isHeader = false,
	...props
}: SubmissionStatusCellProps) => {
	if (isHeader) {
		return (
			<div
				className={cn('flex h-10 items-center gap-2.5 bg-background-strong px-3', className)}
				{...props}
			>
				<p className="font-medium text-body2 text-label-subtle">제출 상태</p>
			</div>
		);
	}

	const { icon, iconColor, label } = statusConfig[status];

	return (
		<div className={cn('flex h-17.5 items-center px-3', className)} {...props}>
			<StatusBadge icon={icon} iconColor={iconColor}>
				{label}
			</StatusBadge>
		</div>
	);
};
