import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';

const textareaVariants = cva(
	'transition-color flex min-h-[120px] w-full resize-none rounded-lg border border-transparent p-4 text-body2 font-medium outline-none placeholder:text-label-assistive focus:border-gray-900 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-red-400',
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

export interface TextareaProps
	extends React.ComponentProps<'textarea'>, VariantProps<typeof textareaVariants> {}

function Textarea({ className, variant, ...props }: TextareaProps) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(textareaVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Textarea };
