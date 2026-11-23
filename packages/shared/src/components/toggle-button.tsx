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

export const ToggleButton = ({
	className,
	label,
	labelClassName,
	id,
	...props
}: ToggleButtonProps) => {
	return (
		<label
			htmlFor={id}
			className={cn(
				'bg-comp-fill-white inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-4 py-3 transition-colors',
				'has-not-checked:text-label-assistive has-checked:text-primary-normal',
				className,
			)}
		>
			<TableCheckbox id={id} {...props} />
			<span className={cn('text-body3 font-semibold', labelClassName)}>{label}</span>
		</label>
	);
};
