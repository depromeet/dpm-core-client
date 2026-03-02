'use client';

import type React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '../utils/cn';

export interface FilterDropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	isSelected?: boolean;
}

export const FilterDropdown = ({
	className,
	label,
	isSelected = false,
	...props
}: FilterDropdownProps) => {
	return (
		<button
			type="button"
			className={cn(
				'flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-comp-fill-white px-4 py-3 font-semibold text-body3 outline-none transition-colors',
				isSelected
					? 'border-primary-normal text-primary-normal'
					: 'border-line-normal text-label-assistive',
				className,
			)}
			{...props}
		>
			<span>{label}</span>
			<ChevronDown
				className={cn(
					'size-4 transition-colors',
					isSelected ? 'text-primary-normal' : 'text-label-assistive',
				)}
			/>
		</button>
	);
};
