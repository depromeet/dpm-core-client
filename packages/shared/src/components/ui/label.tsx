'use client';

import type * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '../../utils/cn';

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				'flex items-center gap-2 text-body2 leading-[142%] font-semibold text-label-subtle select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-40 peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
