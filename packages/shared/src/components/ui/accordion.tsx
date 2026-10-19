'use client';

import type * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { motion } from 'motion/react';

import { cn } from '../../utils/cn';
import { ChevronDown } from '../icons';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	const isSingleType = props.type === 'single';

	if (isSingleType) {
		return (
			<AccordionPrimitive.Root
				collapsible={props.collapsible ?? true}
				data-slot="accordion"
				{...props}
			/>
		);
	}

	return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn('border-b last:border-b-0', className)}
			{...props}
		/>
	);
}

interface AccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
	icon?: React.ReactNode;
}

function AccordionTrigger({ className, children, icon, ...props }: AccordionTriggerProps) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					'flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					className,
				)}
				asChild
				{...props}
			>
				<motion.button type="button" whileTap={{ scale: 0.99 }}>
					{children}
					{icon ?? (
						<ChevronDown className="pointer-events-none size-4 shrink-0 transition-transform duration-200" />
					)}
				</motion.button>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			data-slot="accordion-content"
			className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			{...props}
		>
			<div className={cn('pt-0 pb-4', className)}>{children}</div>
		</AccordionPrimitive.Content>
	);
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
