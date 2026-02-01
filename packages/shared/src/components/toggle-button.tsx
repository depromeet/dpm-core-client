'use client';

import type React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '../utils/cn';

export interface ToggleButtonProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
	label: string;
}

export const ToggleButton = ({ className, label, ...props }: ToggleButtonProps) => {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				'group inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-comp-fill-white px-4 py-3 outline-none transition-colors',
				'data-[state=checked]:text-primary-normal data-[state=unchecked]:text-label-assistive',
				className,
			)}
			{...props}
		>
			<div
				className={cn(
					'flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
					'border-line-normal bg-background-normal',
					'group-data-[state=checked]:border-primary-normal group-data-[state=checked]:bg-primary-normal',
				)}
			>
				<CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
					<CheckIcon className="size-3" />
				</CheckboxPrimitive.Indicator>
			</div>
			<span className="font-semibold text-body3">{label}</span>
		</CheckboxPrimitive.Root>
	);
};
