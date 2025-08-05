'use client';

import { cn } from '@dpm-core/shared';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

interface WeekFilterProps {
	weeks?: { id: number; week: number }[];
}

export const WeekFilter = (props: WeekFilterProps) => {
	const customSearchParams = useCustomSearchParams();

	if (!props.weeks || props.weeks.length === 0) {
		return null;
	}

	const handleFilterWeek = (week: string) => {
		customSearchParams.update({ week }, 'REPLACE');
	};

	return (
		<div className="w-full flex items-center z-10 gap-2 bg-white overflow-x-auto overflow-y-hidden px-0.5 scrollbar-hidden">
			<ToggleGroup.Root
				type="single"
				aria-label="세션 주차 필터"
				defaultValue={customSearchParams.get('week')?.toString()}
				onValueChange={handleFilterWeek}
				className="flex items-center gap-2 whitespace-nowrap w-max"
			>
				{props.weeks.map((week) => (
					<ToggleGroup.Item
						key={week.id}
						value={week.id.toString()}
						className={cn(
							'h-7 px-3 py-1 rounded-lg border text-body2 cursor-pointer font-medium',
							'border-gray-200',
							'transition duration-150 ease-out',
							'data-[state=on]:bg-gray-900 data-[state=on]:border-transparent data-[state=on]:text-white',
							'data-[state=off]:bg-white data-[state=off]:text-gray-500',
						)}
					>
						{week.week}주차
					</ToggleGroup.Item>
				))}
			</ToggleGroup.Root>
		</div>
	);
};
