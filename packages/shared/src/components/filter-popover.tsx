'use client';

import type React from 'react';
import { RotateCcw, X } from 'lucide-react';

import { cn } from '../utils/cn';
import { ChipGroup } from './chip-group';
import { IconButton } from './icon-button';
import { Button } from './ui/button';

export interface FilterSection {
	label: string;
	options: Array<{
		value: string;
		label: string;
	}>;
}

export interface FilterPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	sections: FilterSection[];
	selectedValues?: Record<string, string[]>;
	onClose?: () => void;
	onReset?: () => void;
	onApply?: () => void;
	onFilterChange?: (sectionLabel: string, value: string) => void;
	renderChip?: (option: { value: string; label: string }, isSelected: boolean) => React.ReactNode;
}

export const FilterPopover = ({
	className,
	title = '필터',
	sections,
	selectedValues = {},
	onClose,
	onReset,
	onApply,
	onFilterChange,
	renderChip,
	...props
}: FilterPopoverProps) => {
	return (
		<div
			className={cn(
				'flex w-80 flex-col overflow-hidden rounded-xl bg-background-normal shadow-elevation-2',
				className,
			)}
			{...props}
		>
			{/* Header */}
			<div className="flex items-center gap-2 px-4 pt-8 pb-4">
				<h3 className="flex-1 font-semibold text-label-normal text-title2">{title}</h3>
				<IconButton variant="ghost" size="sm" onClick={onClose}>
					<X className="size-4" />
				</IconButton>
			</div>

			{/* Body */}
			<div className="flex flex-col gap-6 px-8 py-6">
				{sections.map(({ label, options }) => (
					<ChipGroup key={label} label={label}>
						{options.map((option) => {
							const isSelected = selectedValues[label]?.includes(option.value) || false;

							if (renderChip)
								return (
									// 접근성 향상을 위해 button 사용 (키보드 포커스, 스크린 리더 지원)
									// className으로 button 기본 스타일 제거하여 커스텀 chip 디자인 유지
									<button
										type="button"
										key={option.value}
										onClick={() => onFilterChange?.(label, option.value)}
										className="appearance-none border-0 bg-transparent p-0"
									>
										{renderChip(option, isSelected)}
									</button>
								);

							return (
								<button
									key={option.value}
									type="button"
									onClick={() => onFilterChange?.(label, option.value)}
									className={cn(
										'h-8 rounded-full border px-3 py-1 font-medium text-body2 transition-colors',
										isSelected
											? 'border-primary-normal font-semibold text-primary-normal'
											: 'border-line-normal text-label-assistive',
									)}
								>
									{option.label}
								</button>
							);
						})}
					</ChipGroup>
				))}
			</div>

			{/* Footer */}
			<div className="flex gap-2 bg-background-normal px-8 pt-6 pb-8">
				<IconButton variant="default" size="md" onClick={onReset}>
					<RotateCcw className="size-4" />
				</IconButton>
				<Button variant="secondary" size="md" className="flex-1" onClick={onApply}>
					적용하기
				</Button>
			</div>
		</div>
	);
};
