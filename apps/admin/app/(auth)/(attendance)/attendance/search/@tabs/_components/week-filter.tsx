'use client';

import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '@dpm-core/shared';

import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

interface WeekFilterProps {
	weeks?: { id: number; week: number }[];
}

export const WeekFilter = (props: WeekFilterProps) => {
	const customSearchParams = useCustomSearchParams();

	if (!props.weeks || props.weeks.length === 0) {
		return null;
	}

	const weekFilter = customSearchParams.get('week');
	const handleFilterWeek = (week: string) => {
		if (!week) return;
		customSearchParams.update({ week }, 'REPLACE');
	};

	return (
		<div className="scrollbar-hidden z-10 flex w-full items-center gap-2 overflow-x-auto overflow-y-hidden bg-white px-0.5">
			<ToggleGroup.Root
				type="single"
				aria-label="세션 주차 필터"
				value={weekFilter?.toString()}
				onValueChange={handleFilterWeek}
				className="flex w-max items-center gap-2 whitespace-nowrap"
			>
				{props.weeks.map((week) => (
					<ToggleGroup.Item
						key={week.id}
						value={week.id.toString()}
						className={cn(
							'h-7 cursor-pointer rounded-lg border px-3 py-1 font-medium text-body2',
							'border-gray-200',
							'transition duration-150 ease-out',
							'data-[state=on]:border-transparent data-[state=on]:bg-gray-900 data-[state=on]:text-white',
							'data-[state=off]:bg-white data-[state=off]:text-label-assistive',
						)}
					>
						{week.week}주차
					</ToggleGroup.Item>
				))}
			</ToggleGroup.Root>
		</div>
	);
};
