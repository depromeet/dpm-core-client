'use client';

import type React from 'react';

import { cn } from '../utils/cn';

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: string;
}

export const ChipGroup = ({ className, label, children, ...props }: ChipGroupProps) => {
	return (
		<div className={cn('flex flex-col gap-2', className)} {...props}>
			{label && (
				<label className="font-semibold text-body1 text-label-normal">{label}</label>
			)}
			<div className="flex flex-wrap items-center gap-2">{children}</div>
		</div>
	);
};
