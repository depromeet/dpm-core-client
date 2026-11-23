'use client';

import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { type DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '../../utils/cn';
import { Button, buttonVariants } from './button';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'none',
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'group/calendar bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
				...formatters,
			}}
			classNames={{
				root: cn('w-fit', defaultClassNames.root),
				months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
				month: cn('flex w-full flex-col gap-3', defaultClassNames.month),
				nav: cn(
					'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) border border-line-subtle p-0 select-none aria-disabled:opacity-50',
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) border border-line-subtle p-0 select-none aria-disabled:opacity-50',
					defaultClassNames.button_next,
				),
				month_caption: cn(
					'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-body2 font-medium',
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					'has-focus:border-ring border-input has-focus:ring-ring/50 relative rounded-md border shadow-xs has-focus:ring-[3px]',
					defaultClassNames.dropdown_root,
				),
				dropdown: cn('bg-popover absolute inset-0 opacity-0', defaultClassNames.dropdown),
				caption_label: cn(
					'font-semibold select-none',
					captionLayout === 'label'
						? 'text-body1'
						: '[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-body2 [&>svg]:size-3.5',
					defaultClassNames.caption_label,
				),
				table: 'w-full border-collapse',
				weekdays: cn('flex gap-3', defaultClassNames.weekdays),
				weekday: cn(
					'flex aspect-square size-auto flex-1 items-center justify-center rounded-md text-body2 font-normal text-label-assistive select-none',
					defaultClassNames.weekday,
				),
				week: cn('mt-2 flex w-full gap-3', defaultClassNames.week),
				week_number_header: cn('w-(--cell-size) select-none', defaultClassNames.week_number_header),
				week_number: cn(
					'text-muted-foreground text-[0.8rem] select-none',
					defaultClassNames.week_number,
				),
				day: cn(
					'text-label-subtie group/day relative aspect-square h-full w-full p-0 text-center text-body2 font-medium select-none [&:last-child[data-selected=true]_button]:rounded-r-md',
					props.showWeekNumber
						? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-md'
						: '[&:first-child[data-selected=true]_button]:rounded-l-md',
					defaultClassNames.day,
				),
				range_start: cn('bg-accent rounded-l-md', defaultClassNames.range_start),
				range_middle: cn('rounded-none', defaultClassNames.range_middle),
				range_end: cn('bg-accent rounded-r-md', defaultClassNames.range_end),
				today: cn('rounded-md bg-background-strong', defaultClassNames.today),
				outside: cn('text-gray-300 aria-selected:text-label-inverse', defaultClassNames.outside),
				disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
				hidden: cn('invisible', defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				// oxlint-disable-next-line react/no-unstable-nested-components
				Root: ({ className: rootClassName, rootRef, ...rootProps }) => {
					return <div data-slot="calendar" ref={rootRef} className={cn(rootClassName)} {...rootProps} />;
				},
				// oxlint-disable-next-line react/no-unstable-nested-components
				Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
					if (orientation === 'left') {
						return <ChevronLeftIcon className={cn('size-4', chevronClassName)} {...chevronProps} />;
					}

					if (orientation === 'right') {
						return <ChevronRightIcon className={cn('size-4', chevronClassName)} {...chevronProps} />;
					}

					return <ChevronDownIcon className={cn('size-4', chevronClassName)} {...chevronProps} />;
				},
				DayButton: CalendarDayButton,
				// oxlint-disable-next-line react/no-unstable-nested-components
				WeekNumber: ({ children, ...weekNumberProps }) => {
					return (
						<td {...weekNumberProps}>
							<div className="flex size-(--cell-size) items-center justify-center text-center">
								{children}
							</div>
						</td>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	...props
}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<Button
			ref={ref}
			variant="none"
			size="none"
			data-day={day.date.toLocaleDateString()}
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			data-range-start={modifiers.range_start}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			className={cn(
				'data-[range-end=true]:bg-primary data-[range-middle=true]:bg-accent data-[range-start=true]:bg-primary data-[range-middle=true]:text-accent-foreground data-[range-start=true]:text-primary-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-md bg-inherit leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 data-[range-end=true]:text-amber-300 data-[selected-single=true]:bg-background-inverse data-[selected-single=true]:text-label-inverse [&>span]:text-xs [&>span]:opacity-70',
				defaultClassNames.day,
				className,
			)}
			{...props}
		/>
	);
}

export { Calendar, CalendarDayButton };
