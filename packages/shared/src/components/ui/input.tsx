import { cn } from '@dpm-core/shared';
import type * as React from 'react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'bg-background-strong placeholder:text-label-assistive flex h-12 w-full min-w-0 rounded-md p-4 text-body2 font-medium transition-color outline-none',
				'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:border-line-subtle disabled:border',
				'aria-invalid:ring aria-invalid:ring-red-400',
				'focus:ring focus:ring-gray-900',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
