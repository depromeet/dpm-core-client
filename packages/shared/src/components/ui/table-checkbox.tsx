'use client';

import type * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '../../utils/cn';

export const TableCheckbox = ({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
	return (
		<CheckboxPrimitive.Root
			data-slot="table-checkbox"
			className={cn(
				'peer flex size-4 shrink-0 items-center justify-center rounded-sm border border-line-normal bg-background-normal outline-none transition-colors',
				'focus-visible:ring-2 focus-visible:ring-primary-normal focus-visible:ring-offset-2',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'data-[state=checked]:border-primary-normal data-[state=checked]:bg-primary-normal',
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="table-checkbox-indicator"
				className="flex items-center justify-center text-white"
			>
				<CheckIcon className="size-3" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
};
