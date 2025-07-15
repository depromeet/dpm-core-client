'use client';

import { cn } from '@dpm-core/shared';
import * as LabelPrimitive from '@radix-ui/react-label';
import type * as React from 'react';

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-40 peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
