'use client';

import type React from 'react';

import { cn } from '../utils/cn';

export interface ChipGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
	label?: string;
}

export const ChipGroup = ({ className, label, children, ...props }: ChipGroupProps) => {
	return (
		<fieldset className={cn('flex flex-col gap-2', className)} {...props}>
			{label && <legend className="font-semibold text-body1 text-label-normal">{label}</legend>}
			<div className="flex flex-wrap items-center gap-2">{children}</div>
		</fieldset>
	);
};
