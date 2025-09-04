'use client';

import { Calendar, FormControl, FormField, FormItem, FormLabel } from '@dpm-core/shared';
import { ko } from 'date-fns/locale';
import { useFormContext } from 'react-hook-form';

export const FormDate = () => {
	const form = useFormContext();

	return (
		<div className="flex flex-col gap-2">
			<div>
				<FormField
					control={form.control}
					name="heldAt"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="h-5 flex items-center text-label-subtle text-body2 font-semibold">
								회식 날짜
							</FormLabel>
							<FormControl>
								<Calendar
									locale={ko}
									formatters={{
										formatCaption: (date) => date.toLocaleDateString('ko-KR', { month: 'long' }),
										formatWeekdayName: (date) =>
											date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
									}}
									className="px-5 py-4.5 border border-line-subtle rounded-md"
									mode="single"
									selected={field.value}
									onSelect={field.onChange}
									disabled={(date) => date < new Date('1900-01-01')}
									classNames={{
										root: 'w-full h-full',
										months: 'w-full h-full relative',
										month: 'flex flex-col w-full gap-3',
										month_caption: 'flex items-center justify-center w-full h-7',
										caption_label: 'text-body1 text-label-normal font-semibold',
										nav: 'absolute top-0 inset-x-0 flex items-center justify-between',
										weekdays:
											'grid grid-cols-7 gap-x-[calc((100%-32px*7)/6)] mb-2 place-items-center',
										weekday:
											'w-8 h-8 flex items-center justify-center text-body2 font-medium text-label-assistive',
										week: 'grid grid-cols-7 gap-x-[calc((100%-32px*7)/6)] mb-2 place-items-center',
										day: 'w-8 h-8 flex items-center justify-center text-body2 font-medium text-label-subtle ',
										today: 'bg-background-strong text-label-assistive rounded-md',
										selected: '!bg-background-inverse rounded-md !text-white',
										button_previous:
											'w-7 h-7 border border-line-subtle rounded-md flex items-center justify-center text-label-normal cursor-pointer',
										button_next:
											'w-7 h-7 border border-line-subtle rounded-md flex items-center justify-center text-label-normal cursor-pointer',
										outside: '!text-label-disable',
									}}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
