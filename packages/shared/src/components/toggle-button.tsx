'use client';

import type React from 'react';
import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '../utils/cn';
import { TableCheckbox } from './ui/table-checkbox';

export interface ToggleButtonProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
	label: string;
}

export const ToggleButton = ({ className, label, id, ...props }: ToggleButtonProps) => {
	return (
		<label
			htmlFor={id}
			className={cn(
				'inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-comp-fill-white px-4 py-3 transition-colors',
				'has-checked:text-primary-normal has-not-checked:text-label-assistive',
				className,
			)}
		>
			<TableCheckbox id={id} {...props} />
			<span className="font-semibold text-body3">{label}</span>
		</label>
	);
};
