'use client';

import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
	Circle,
	CircleAlert,
	CircleCheck,
	CircleMinus,
	CircleX,
	type LucideIcon,
} from 'lucide-react';

import { cn } from '../utils/cn';

const statusBadgeVariants = cva('inline-flex items-center gap-1 font-semibold text-body2', {
	variants: {
		status: {
			success: 'text-label-subtle',
			error: 'text-label-subtle',
			warning: 'text-label-subtle',
			pending: 'text-label-subtle',
			default: 'text-label-subtle',
		},
	},
	defaultVariants: {
		status: 'default',
	},
});

const iconMap: Record<string, LucideIcon> = {
	success: CircleCheck,
	error: CircleX,
	warning: CircleAlert,
	pending: CircleMinus,
	default: Circle,
};

const iconColorMap: Record<string, string> = {
	success: 'text-primary-normal',
	error: 'text-red-500',
	warning: 'text-yellow-600',
	pending: 'text-label-assistive',
	default: 'text-label-assistive',
};

export interface StatusBadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof statusBadgeVariants> {
	icon?: LucideIcon;
	iconColor?: string;
}

export const StatusBadge = ({
	className,
	status = 'default',
	icon,
	iconColor,
	children,
	...props
}: StatusBadgeProps) => {
	const Icon = icon || iconMap[status || 'default'];
	const defaultIconColor = iconColorMap[status || 'default'];

	return (
		<div className={cn(statusBadgeVariants({ status, className }))} {...props}>
			<Icon className={cn('size-5 shrink-0', iconColor || defaultIconColor)} />
			<span>{children}</span>
		</div>
	);
};
