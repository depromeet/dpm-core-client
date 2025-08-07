import { FormDate, FormDescription, FormRange, FormTitle } from './form';

export const InformationFormItem = () => {
	return (
		<>
			<div className="px-4 h-10 flex items-center">
				<h2 className="text-title2 font-semibold text-label-strong">기본 정보</h2>
			</div>
			<div className="p-4 flex flex-col gap-10">
				<FormDate />
				<FormTitle />
				<FormDescription />
				<FormRange />
			</div>
		</>
	);
};
