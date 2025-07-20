'use client';

import { useState } from 'react';
import AttendList from '../detail/AttendList';

export default function AttendTemplete() {
	type FilterType = 'all' | 'attend' | 'absent';

	const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
	return (
		<>
			<div className="px-4 pt-2 fixed max-w-lg top-12 mx-auto left-0 right-0 z-10 bg-white">
				<div className="flex items-center text-body1">
					{(
						[
							{ label: '제출 전체', value: 'all' },
							{ label: '참석함', value: 'attend' },
							{ label: '참석 안함', value: 'absent' },
						] as { label: string; value: FilterType }[]
					).map((filter) => (
						<button
							key={filter.value}
							type="button"
							className={`flex-1 h-10 flex items-center justify-center cursor-pointer bg-transparent outline-none ${
								currentFilter === filter.value
									? 'border-b-2 border-gray-900 text-gray-800 font-semibold'
									: 'border-b border-transparent text-gray-400 font-medium'
							}`}
							onClick={() => setCurrentFilter(filter.value)}
						>
							{filter.label} 65
						</button>
					))}
				</div>
			</div>

			<AttendList />
		</>
	);
}
