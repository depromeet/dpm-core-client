import React from 'react';

const FormRange = () => {
	return (
		<div className="flex flex-col gap-2">
			<div className="h-5 flex items-center text-gray-600 text-body2 font-semibold">
				정산서 초대 범위
			</div>
			<div className="p-4 rounded-md rounded-lg border border-line-noraml flex items-center gap-1">
				<div className="flex items-center gap-1 py-[3px] px-[5px] bg-gray-100 text-caption1 font-semibold rounded-[4px] ">
					<p className="text-gray-400 ">@</p>
					<p className="text-gray-500 ">17기 운영진</p>
				</div>
				<div className="flex items-center gap-1 py-[3px] px-[5px] bg-gray-100 text-caption1 font-semibold rounded-[4px] ">
					<p className="text-gray-400 ">@</p>
					<p className="text-gray-500 ">17기 디퍼</p>
				</div>
			</div>
		</div>
	);
};

export default FormRange;
