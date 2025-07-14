'use client';

import * as ToggleGroup from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { useState } from 'react';

const FILTERS = [
	{ value: 'all', label: '전체' },
	{ value: 'before', label: '멤버 확정 전' },
	{ value: 'progress', label: '정산 중' },
	{ value: 'done', label: '정산 끝' },
] as const;

type FilterValue = (typeof FILTERS)[number]['value'];

export default function SettleHeaderFilter() {
	const [value, setValue] = useState<FilterValue>('all');

	return (
		<div className="h-12 flex items-center gap-2 overflow-x-auto px-0.5">
			<ToggleGroup.Root
				type="single"
				value={value}
				aria-label="정산 상태 필터"
				onValueChange={(v) => v && setValue(v as FilterValue)}
				className="flex gap-2"
			>
				{FILTERS.map(({ value: v, label }) => (
					<ToggleGroup.Item
						key={v}
						value={v}
						className={clsx(
							'px-3 py-[5px] rounded-lg border text-sm cursor-pointer font-medium',
							'border-gray-200',
							'transition duration-150 ease-out',
							'data-[state=on]:bg-gray-900 data-[state=on]:text-white',
							'data-[state=off]:bg-white data-[state=off]:text-gray-500',
							'transform hover:scale-105 active:scale-95',
						)}
					>
						{label}
					</ToggleGroup.Item>
				))}
			</ToggleGroup.Root>
		</div>
	);
}
