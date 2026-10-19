'use client';

import { X } from 'lucide-react';
import { Button, ChipGroup, cn, type FilterPopoverProps, IconButton } from '@dpm-core/shared';

import { RotateCwIcon } from './attendance-icons';

interface FilterOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface FilterSection {
	label: string;
	options: FilterOption[];
}

interface AttendanceFilterPopoverProps
	extends Pick<
		FilterPopoverProps,
		'title' | 'selectedValues' | 'onClose' | 'onReset' | 'onApply' | 'onFilterChange'
	> {
	sections: FilterSection[];
}

export const AttendanceFilterPopover = ({
	title = '필터',
	sections,
	selectedValues = {},
	onClose,
	onReset,
	onApply,
	onFilterChange,
}: AttendanceFilterPopoverProps) => (
	<div className="relative flex w-90 flex-col overflow-hidden rounded-xl bg-background-normal shadow-[0px_-4px_21.1px_0px_rgba(0,0,0,0.12)]">
		<div className="flex items-center gap-2 px-4 py-5">
			<h3 className="flex-1 pr-9 font-semibold text-label-normal text-title2">{title}</h3>
			<IconButton
				variant="ghost"
				size="sm"
				className="absolute top-5 right-4 size-7 rounded-full bg-background-strong p-1.5 text-label-assistive"
				onClick={onClose}
			>
				<X className="size-4" />
			</IconButton>
		</div>
		<div className="flex flex-col gap-7.5 px-4 pb-5">
			{sections.map(({ label, options }) => (
				<ChipGroup
					key={label}
					label={label}
					className="first:[&>div]:max-w-70 [&>legend]:mb-2 last:[&>legend]:mb-3"
				>
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							disabled={option.disabled}
							onClick={() => onFilterChange?.(label, option.value)}
							className={cn(
								'h-8 rounded-full border px-3 py-1 font-medium text-body2 transition-colors disabled:cursor-not-allowed disabled:opacity-40',
								selectedValues[label]?.includes(option.value)
									? 'border-primary-normal font-semibold text-primary-normal'
									: 'border-line-normal text-label-assistive',
							)}
						>
							{option.label}
						</button>
					))}
				</ChipGroup>
			))}
		</div>
		<div className="flex gap-2 bg-background-normal px-4 py-3">
			<IconButton
				variant="default"
				size="md"
				className="size-12 bg-background-strong text-label-assistive"
				onClick={onReset}
			>
				<RotateCwIcon />
			</IconButton>
			<Button variant="secondary" size="lg" className="flex-1" onClick={onApply}>
				적용하기
			</Button>
		</div>
	</div>
);
