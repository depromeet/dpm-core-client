import type * as React from 'react';

import { cn } from '../../utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'flex h-12 w-full min-w-0 rounded-md bg-background-strong p-4 font-medium text-body2 outline-none transition-color placeholder:text-label-assistive',
				'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border disabled:border-line-subtle disabled:opacity-50',
				'aria-invalid:ring aria-invalid:ring-red-400',
				'focus:ring focus:ring-gray-900',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
