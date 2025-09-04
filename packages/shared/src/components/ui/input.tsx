import type * as React from 'react';
import { cn } from '../../utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'bg-background-strong placeholder:text-label-assistive flex w-full h-12 min-w-0 rounded-lg p-4 text-body2 font-medium transition-color outline-none border border-transparent',
				'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
				'aria-invalid:border-red-400',
				'focus:border-gray-900',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
