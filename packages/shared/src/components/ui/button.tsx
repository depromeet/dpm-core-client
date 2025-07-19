import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../utils/cn';

const buttonVariants = cva(
	'inline-flex items-center cursor-pointer justify-center gap-1.5 whitespace-nowrap disabled:pointer-events-none disabled:opacity-40 shrink-0 outline-none',
	{
		variants: {
			variant: {
				none: 'bg-inherit text-inherit',
				primary: 'bg-primary-normal hover:bg-primary-strong text-label-inverse',
				secondary: 'bg-background-inverse hover:bg-gray-700 text-label-inverse',
				assistive: 'bg-background-strong hover:bg-background-heavy text-label-normal',
				text: 'text-label-assistive disabled:text-label-subtle',
			},
			size: {
				none: 'h-auto',
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

interface ButtonProps extends React.ComponentProps<'button'> {
	variant?: 'primary' | 'secondary' | 'assistive' | 'text' | 'none';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full' | 'none';
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				ref={ref}
				data-slot="button"
				className={cn(buttonVariants({ variant, size, className }))}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';

export { Button, buttonVariants };
