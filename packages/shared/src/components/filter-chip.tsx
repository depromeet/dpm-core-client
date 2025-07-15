'use client';

import { cn } from '@dpm-core/shared';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type React from 'react';

export const FilterChip = ({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	children: React.ReactNode;
}) => {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				'text-body2 font-medium border rounded-[170px] text-label-assistive border-line-noraml px-3 py-1 data-[state=checked]:border-primary-normal data-[state=checked]:text-primary-normal data-[state=checked]:font-semibold',
				className,
			)}
			{...props}
		/>
	);
};
