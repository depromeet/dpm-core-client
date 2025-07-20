'use client';

import React from 'react';

const FormTitle = () => {
	return (
		<div className="flex flex-col gap-2">
			<div className="h-5 flex items-center text-gray-600 text-body2 font-semibold">
				정산서 이름
			</div>
			<input
				type="text"
				placeholder="ex. 17기 OT 회식"
				className="p-4 rounded-lg text-gray-700 font-medium border text-body2  border-line-noraml outline-none focus:border-gray-600 "
			/>
			<p className="flex justify-end text-gray-600 text-caption1 font-medium ">0/20자</p>
		</div>
	);
};

export default FormTitle;
