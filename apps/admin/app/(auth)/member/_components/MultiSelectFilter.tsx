'use client';

import { useState } from 'react';
import {
	cn,
	FilterDropdown,
	FilterPopover,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@dpm-core/shared';

import { formatFilterLabel } from '../_lib/format-filter-label';

export interface MultiSelectFilterOption<T extends string> {
	value: T;
	label: string;
}

interface MultiSelectFilterProps<T extends string> {
	title: string;
	options: MultiSelectFilterOption<T>[];
	value: T[];
	onChange: (next: T[]) => void;
}

/**
 * 여러 값을 고르는 필터 하나.
 * 팝오버 안에서 고른 값은 "적용하기" 를 누를 때까지 밖으로 나가지 않는다.
 * 무엇을 고르는지는 모르고 options 와 value 만 다룬다.
 */
export const MultiSelectFilter = <T extends string>({
	title,
	options,
	value,
	onChange,
}: MultiSelectFilterProps<T>) => {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<T[]>(value);

	const handleOpenChange = (next: boolean) => {
		// 열 때마다 바깥 값으로 되돌려, 적용하지 않고 닫은 선택이 남지 않게 한다.
		if (next) setDraft(value);
		setOpen(next);
	};

	const getLabel = (target: T) =>
		options.find((option) => option.value === target)?.label ?? target;

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<FilterDropdown
					label={formatFilterLabel(value, getLabel, title)}
					isSelected={value.length > 0}
						className={cn(
							'gap-1 text-body2',
							value.length > 0 ? 'font-semibold' : 'border-line-subtle font-medium',
						)}
						iconClassName="size-3"
				/>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-auto border-0 bg-background-normal p-0 shadow-none"
			>
				<FilterPopover
					className="w-60"
					title={title}
					sections={[{ label: title, options }]}
					selectedValues={{ [title]: draft }}
					onClose={() => setOpen(false)}
					onReset={() => setDraft([])}
					onApply={() => {
						onChange(draft);
						setOpen(false);
					}}
					onFilterChange={(_section, changed) =>
						setDraft((prev) =>
							prev.includes(changed as T)
								? prev.filter((item) => item !== changed)
								: [...prev, changed as T],
						)
					}
				/>
			</PopoverContent>
		</Popover>
	);
};
