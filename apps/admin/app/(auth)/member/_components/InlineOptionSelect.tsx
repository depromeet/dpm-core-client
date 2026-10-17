'use client';

import type React from 'react';
import { useState } from 'react';
import { cn, Popover, PopoverContent, PopoverTrigger } from '@dpm-core/shared';

export interface InlineOption<T extends string | number> {
	value: T;
	label: string;
	/** 고를 수는 없지만 현재 값으로는 보여줘야 하는 항목 */
	disabled?: boolean;
}

interface InlineOptionSelectProps<T extends string | number> {
	options: InlineOption<T>[];
	value: T;
	onChange: (value: T) => void;
	/** 셀에 이미 그려져 있는 칩을 그대로 트리거로 쓴다. */
	children: React.ReactNode;
	align?: 'start' | 'center' | 'end';
}

/** 셀 바로 아래에 펼쳐지는 단일 선택 목록. 값의 의미는 모르고 목록만 다룬다. */
export const InlineOptionSelect = <T extends string | number>({
	options,
	value,
	onChange,
	children,
	align = 'start',
}: InlineOptionSelectProps<T>) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				align={align}
				className="w-auto min-w-30 rounded-xl border-line-subtle p-1 shadow-[0px_-4px_21.1px_0px_rgba(0,0,0,0.12)]"
			>
				<ul className="flex flex-col">
					{options.map((option) => (
						<li key={option.value}>
							<button
								type="button"
								disabled={option.disabled}
								onClick={() => {
									onChange(option.value);
									setOpen(false);
								}}
								className={cn(
									'flex h-10 w-full cursor-pointer items-center whitespace-nowrap rounded-lg px-3 text-left font-medium text-body2 transition-colors',
									option.value === value
										? 'font-semibold text-primary-normal'
										: 'text-label-subtle hover:bg-background-strong',
									option.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
								)}
							>
								{option.label}
							</button>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
};
