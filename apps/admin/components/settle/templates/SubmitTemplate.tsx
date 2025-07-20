'use client';

import { useState } from 'react';
import SubmitList from '../detail/SubmitList';

export default function SubmitTemplete() {
	const [currentFilter, setCurrentFilter] = useState<'submitted' | 'unsubmitted'>('submitted');

	return (
		<>
			<div className="px-4 pt-2 fixed top-12 max-w-lg mx-auto left-0 right-0 z-10 bg-white ">
				<div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600 text-caption1 font-medium">
					초대 멤버 전원이 참석 여부를 제출하면 멤버를 확정할 수 있어요.
				</div>
			</div>

			<div className="px-4 pt-2 fixed max-w-lg top-24 mx-auto left-0 right-0 z-10 bg-white">
				<div className="flex items-center text-body1">
					<button
						type="button"
						className={`flex-1 h-10 flex items-center justify-center cursor-pointer bg-transparent outline-none 
        ${
					currentFilter === 'submitted'
						? 'border-b-2 border-gray-900 text-gray-800 font-semibold'
						: 'border-b border-transparent text-gray-400 font-medium'
				}`}
						onClick={() => setCurrentFilter('submitted')}
					>
						제출 5
					</button>

					<button
						type="button"
						className={`flex-1 h-10 flex items-center justify-center cursor-pointer bg-transparent outline-none 
        ${
					currentFilter === 'unsubmitted'
						? 'border-b-2 border-gray-900 text-gray-800 font-semibold'
						: 'border-b border-transparent text-gray-400 font-medium'
				}`}
						onClick={() => setCurrentFilter('unsubmitted')}
					>
						미제출 65
					</button>
				</div>
			</div>

			<SubmitList />
		</>
	);
}
