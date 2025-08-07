import type { UseFieldArrayRemove } from 'react-hook-form';
import { FormStepItem } from './form-step-item';

interface FormStepListPros {
	fields: Record<'id', string>[];
	remove: UseFieldArrayRemove;
}

export const FormStepList = ({ fields, remove }: FormStepListPros) => {
	return (
		<ul className="flex flex-col gap-6">
			{fields.map((field, index) => (
				<FormStepItem key={field.id} index={index} onRemove={() => remove(index)} />
			))}
		</ul>
	);
};
