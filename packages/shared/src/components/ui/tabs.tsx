'use client';

import { cn } from '../../utils/cn';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import type * as React from 'react';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />
	);
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn('inline-flex h-12 w-full items-center justify-center', className)}
			{...props}
		/>
	);
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"data-[state=active]:bg-background text-label-assistive inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent text-body1 font-semibold whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-40 outline-none data-[state=active]:text-label-normal data-[state=active]:border-gray-900 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn('flex-1 outline-none', className)}
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
