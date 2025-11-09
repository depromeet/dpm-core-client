'use client';

import type React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '../utils/cn';

export const FilterChip = ({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	children: React.ReactNode;
}) => {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				'cursor-pointer rounded-[170px] border border-line-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=checked]:border-primary-normal data-[state=checked]:font-semibold data-[state=checked]:text-primary-normal',
				className,
			)}
			{...props}
		/>
	);
};
