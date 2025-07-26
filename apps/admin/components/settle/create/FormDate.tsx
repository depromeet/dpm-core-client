'use client';

import { Calendar } from '@dpm-core/shared';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

const FormDate = () => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

	console.log('selectedDate', selectedDate);
	return (
		<div className="flex flex-col gap-2">
			{/* 레이블 */}
			<div className="h-5 flex items-center text-gray-600 text-body2 font-semibold">회식 날짜</div>

			<div className="w-full max-w-full h-[340px] py-[14px] px-[20px] border border-line-subtle rounded-[6px]">
				<Calendar
					locale={ko}
					formatters={{
						formatCaption: (date) => date.toLocaleDateString('ko-KR', { month: 'long' }),
						formatWeekdayName: (date) =>
							date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
					}}
					mode="single"
					selected={selectedDate}
					onSelect={setSelectedDate}
					classNames={{
						root: 'w-full h-full',
						months: 'w-full h-full relative',
						month: 'w-full h-full flex flex-col ',
						month_caption:
							'mb-5 flex items-center justify-center h-[--cell-size] w-full px-[--cell-size]',
						nav: 'absolute top-0 inset-x-0 flex items-center justify-between px-2',
						weekdays: 'grid grid-cols-7 place-items-center mb-2',
						weekday:
							'w-8 h-8 flex items-center justify-center text-body2 font-medium text-gray-500',
						week: 'grid grid-cols-7 place-items-center mb-2',
						day: 'w-8 h-8 flex items-center justify-center text-body2 font-medium text-gray-600 data-[selected-single=true]:!bg-gray-800 data-[selected-single=true]:!text-white',
						today: 'bg-gray-100 rounded-[6px]',
						selected: 'bg-gray-800 rounded-[6px] text-white',
						button_previous:
							'w-7 h-7 border border-line-subtle rounded-[6px] flex items-center justify-center text-gray-900 cursor-pointer',
						button_next:
							'w-7 h-7 border border-line-subtle rounded-[6px] flex items-center justify-center text-gray-900 cursor-pointer',
					}}
				/>
			</div>
		</div>
	);
};

export default FormDate;
