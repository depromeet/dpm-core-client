'use client';

import type * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '../../utils/cn';

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				'flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-40 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-40',
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
