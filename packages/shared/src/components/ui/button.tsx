import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/cn';

const buttonVariants = cva(
	'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap outline-none disabled:pointer-events-none disabled:opacity-40',
	{
		variants: {
			variant: {
				none: 'bg-inherit text-inherit',
				primary: 'bg-primary-normal text-label-inverse hover:bg-primary-strong',
				secondary: 'bg-background-inverse text-label-inverse hover:bg-gray-700',
				assistive: 'bg-background-strong text-label-normal hover:bg-background-heavy',
				text: 'text-label-assistive disabled:text-label-subtle',
			},
			size: {
				none: 'h-auto',
				xs: 'h-6 rounded-sm px-2.5 font-medium text-caption1',
				sm: 'h-8 rounded-md px-3 font-medium text-caption1',
				md: 'h-10 rounded-lg px-4 font-semibold text-body2',
				lg: 'h-12 rounded-lg px-5 font-semibold text-body1',
				full: 'h-14 w-full font-semibold text-body1',
			},
		},
		compoundVariants: [
			{
				variant: 'text',
				size: ['full', 'lg', 'md', 'sm', 'xs', 'none'],
				className: 'h-auto w-auto px-0',
			},
		],
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
);

export interface ButtonProps extends React.ComponentProps<'button'> {
	variant?: 'primary' | 'secondary' | 'assistive' | 'text' | 'none';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full' | 'none';
	asChild?: boolean;
	loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			children,
			disabled = false,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';

		const isDisabled = loading || disabled;

		return (
			<Comp
				ref={ref}
				data-slot="button"
				className={cn(buttonVariants({ variant, size, className }))}
				disabled={isDisabled}
				{...props}
			>
				{children}
			</Comp>
		);
	},
);

Button.displayName = 'Button';

export { Button, buttonVariants };
