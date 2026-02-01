'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';

const iconButtonVariants = cva(
	'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40',
	{
		variants: {
			variant: {
				ghost: 'hover:bg-background-strong',
				default: 'bg-background-normal hover:bg-background-strong',
			},
			size: {
				sm: 'size-8 p-2',
				md: 'size-10 p-2.5',
				lg: 'size-12 p-3',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export interface IconButtonProps
	extends React.ComponentProps<'button'>,
		VariantProps<typeof iconButtonVariants> {
	asChild?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp ref={ref} className={cn(iconButtonVariants({ variant, size, className }))} {...props} />
		);
	},
);

IconButton.displayName = 'IconButton';
