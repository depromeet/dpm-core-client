'use client';

import type React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '../utils/cn';

export interface FilterDropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	isSelected?: boolean;
	/** 화살표 아이콘 크기·색 등을 화면별로 덮어쓸 때 사용한다. */
	iconClassName?: string;
}

export const FilterDropdown = ({
	className,
	label,
	isSelected = false,
	iconClassName,
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
					iconClassName,
				)}
			/>
		</button>
	);
};
