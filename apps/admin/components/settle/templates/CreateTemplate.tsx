import React from 'react';
import CreateFormWrapper from '../create/CreateFormWrapper';
import StepWrapper from '../create/StepWrapper';
import FixedBottomBtn from '../layout/FixedBottomBtn';

const CreateTemplate = () => {
	return (
		<>
			<CreateFormWrapper />
			<div className="h-6" />
			<StepWrapper />
			<FixedBottomBtn title="정산서 생성하기" />
			{/* <CreateBottomSheet /> */}
		</>
	);
};

export default CreateTemplate;
