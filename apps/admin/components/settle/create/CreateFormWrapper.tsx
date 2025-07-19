import React from 'react';
import FormDate from './FormDate';
import FormDesc from './FormDesc';
import FormRange from './FormRange';
import FormTitle from './FormTitle';

const CreateFormWrapper = () => {
	return (
		<>
			<div className="px-4 h-10 flex items-center">
				<h2 className="text-title2 font-semibold text-gray-900">기본 정보</h2>
			</div>
			<div className="p-4 flex flex-col gap-10">
				<FormDate />
				<FormTitle />
				<FormDesc />
				<FormRange />
			</div>
		</>
	);
};

export default CreateFormWrapper;
