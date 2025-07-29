'use client';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { type DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '../../utils/cn';

import { Button, buttonVariants } from './button';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'text',
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
				'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
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
				months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
				month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
				nav: cn(
					'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
					defaultClassNames.button_next,
				),
				month_caption: cn(
					'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
					defaultClassNames.dropdown_root,
				),
				dropdown: cn('absolute bg-popover inset-0 opacity-0', defaultClassNames.dropdown),
				caption_label: cn('select-none text-body1 font-semibold', defaultClassNames.caption_label),
				table: 'w-full border-collapse',
				weekdays: cn('flex', defaultClassNames.weekdays),
				weekday: cn(
					'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
					defaultClassNames.weekday,
				),
				week: cn('flex w-full mt-2', defaultClassNames.week),
				week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
				week_number: cn(
					'text-[0.8rem] select-none text-muted-foreground',
					defaultClassNames.week_number,
				),
				day: cn(
					'relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
					defaultClassNames.day,
				),
				range_start: cn('rounded-l-md bg-accent', defaultClassNames.range_start),
				range_middle: cn('rounded-none', defaultClassNames.range_middle),
				range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
				today: 'text-accent-foreground',
				outside: cn(
					'text-muted-foreground aria-selected:text-muted-foreground',
					defaultClassNames.outside,
				),
				disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
				hidden: cn('invisible', defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === 'left') {
						return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
					}

					if (orientation === 'right') {
						return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
					}

					return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
				},
				DayButton: (props) => (
					<CalendarDayButton
						{...props}
						className="data-[selected-single=true]:!bg-gray-800 data-[selected-single=true]:!text-white"
					/>
				),
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
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

	const isSelectedToday =
		modifiers.selected &&
		modifiers.today &&
		!modifiers.range_start &&
		!modifiers.range_middle &&
		!modifiers.range_end;

	return (
		<Button
			ref={ref}
			variant="text"
			size="lg"
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
				'flex items-center justify-center text-body2 font-medium',
				'[&>span]:block [&>span]:leading-none',
				'min-w-[48px] min-h-[48px] w-full h-full',
				isSelectedToday && '!bg-gray-800 !text-white',

				!isSelectedToday && modifiers.selected && '!bg-gray-800 !text-white',

				modifiers.range_start && 'bg-primary text-white',
				modifiers.range_middle && 'bg-accent text-accent-foreground',
				modifiers.range_end && 'bg-primary text-white',

				!modifiers.selected && modifiers.today && 'text-gray-600',

				modifiers.outside && '!text-gray-200',
				!modifiers.outside && !modifiers.today && !modifiers.selected && 'text-gray-600',

				defaultClassNames.day,
				className,
			)}
			{...props}
		/>
	);
}

export { Calendar, CalendarDayButton };
