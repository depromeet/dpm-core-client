'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from '../utils/cn';

const ToggleGroupContext = React.createContext<{
	variant?: 'default' | 'outline';
	size?: 'sm' | 'md' | 'lg';
}>({
	variant: 'default',
	size: 'md',
});

export interface ToggleGroupProps
	extends Omit<
		React.ComponentPropsWithRef<typeof ToggleGroupPrimitive.Root>,
		'type' | 'value' | 'onValueChange'
	> {
	variant?: 'default' | 'outline';
	size?: 'sm' | 'md' | 'lg';
	type: 'single' | 'multiple';
	value?: string | string[];
	onValueChange?: ((value: string | string[]) => void) | ((value: string) => void);
}

export const ToggleGroup = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Root>,
	ToggleGroupProps
>(({ className, variant = 'default', size = 'md', children, type, ...props }, ref) => {
	const rootProps = {
		...props,
		type,
	} as Parameters<typeof ToggleGroupPrimitive.Root>[0];

	return (
		<ToggleGroupPrimitive.Root
			ref={ref}
			className={cn(
				'flex items-center overflow-hidden rounded-lg border border-gray-300',
				className,
			)}
			{...rootProps}
		>
			<ToggleGroupContext.Provider value={{ variant, size }}>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive.Root>
	);
});

ToggleGroup.displayName = 'ToggleGroup';

export const ToggleGroupItem = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Item>,
	React.ComponentProps<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
	const { size } = React.useContext(ToggleGroupContext);

	const sizeClasses = {
		sm: 'h-8 px-3 text-caption1',
		md: 'h-12 px-3 text-body2',
		lg: 'h-14 px-4 text-body1',
	};

	return (
		<ToggleGroupPrimitive.Item
			ref={ref}
			className={cn(
				'flex flex-1 items-center justify-center font-medium text-label-assistive transition-colors',
				'bg-background-normal',
				'data-[state=on]:bg-primary-extralight data-[state=on]:font-semibold data-[state=on]:text-primary-normal',
				'not-last:border-gray-300 not-last:border-r',
				'hover:bg-background-strong',
				'disabled:pointer-events-none disabled:opacity-50',
				sizeClasses[size || 'md'],
				className,
			)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
});

ToggleGroupItem.displayName = 'ToggleGroupItem';
