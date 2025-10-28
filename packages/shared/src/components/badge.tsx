import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';

const bedgeVariants = cva(
	'inline-flex items-center justify-center rounded-sm p-[5px] py-[3px] font-semibold text-caption1',
	{
		variants: {
			variant: {
				none: 'bg-inherit text-inherit',
				AT_RISK: 'bg-red-100 text-red-500',
				IMPOSSIBLE: 'bg-gray-100 text-gray-500',
				NORMAL: 'bg-green-100 text-green-500',
			},
		},
		defaultVariants: {
			variant: 'none',
		},
	},
);

function Badge({
	className,
	variant,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof bedgeVariants>) {
	return <span className={cn(bedgeVariants({ variant, className }))} {...props} />;
}

export { Badge };
