import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:pointer-events-none disabled:opacity-40 shrink-0 outline-none',
	{
		variants: {
			variant: {
				primary: 'bg-primary-normal hover:bg-primary-strong text-label-inverse',
				secondary: 'bg-background-inverse hover:bg-gray-700 text-label-inverse',
				assistive: 'bg-background-strong hover:bg-background-heavy text-label-normal',
				text: 'text-label-assistive disabled:text-label-subtle',
			},
			size: {
				xs: 'h-6 px-2.5 rounded-sm text-caption1 font-medium',
				sm: 'h-8 px-3 rounded-md text-caption1 font-medium',
				md: 'h-10 px-4 rounded-lg  text-body2  font-semibold',
				lg: 'h-12 px-5 rounded-lg text-body1 font-semibold',
				full: 'w-full h-14 text-body1 font-semibold',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot="button"
			onContextMenu={(e) => e.preventDefault()}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
