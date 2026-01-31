'use client';

import type React from 'react';

import { cn } from '../../utils/cn';
import { Checkbox } from '../ui/checkbox';

export interface CheckboxCellProps extends React.ComponentProps<typeof Checkbox> {
	isHeader?: boolean;
}

export const CheckboxCell = ({ className, isHeader = false, ...props }: CheckboxCellProps) => {
	return (
		<div
			className={cn(
				'flex items-center pl-3',
				isHeader ? 'size-10 bg-background-strong' : 'size-10 bg-background-normal',
				className,
			)}
		>
			<Checkbox {...props} />
		</div>
	);
};
