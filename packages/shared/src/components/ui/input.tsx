import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';

const inputVariants = cva(
	'flex h-12 w-full min-w-0 rounded-lg border border-transparent p-4 font-medium text-body2 outline-none transition-color placeholder:text-label-assistive focus:border-gray-900 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-red-400',
	{
		variants: {
			variant: {
				line: 'border-line-normal bg-background-normal',
				filled: 'bg-background-strong',
			},
		},
		defaultVariants: {
			variant: 'filled',
		},
	},
);

export interface InputProps
	extends React.ComponentProps<'input'>,
		VariantProps<typeof inputVariants> {}

function Input({ className, variant, type, ...props }: InputProps) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(inputVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Input };
