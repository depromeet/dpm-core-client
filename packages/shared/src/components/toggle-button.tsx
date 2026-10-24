'use client';

import type React from 'react';
import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '../utils/cn';
import { TableCheckbox } from './ui/table-checkbox';

export interface ToggleButtonProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
	label: string;
	/** 라벨 글꼴을 화면별로 덮어쓸 때 사용한다. */
	labelClassName?: string;
}

export const ToggleButton = ({ className, label, labelClassName, id, ...props }: ToggleButtonProps) => {
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
			<span className={cn('font-semibold text-body3', labelClassName)}>{label}</span>
		</label>
	);
};
