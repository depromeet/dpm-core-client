import { FormControl, FormField, FormItem, FormLabel } from '@dpm-core/shared';
import { useFormContext, useWatch } from 'react-hook-form';

const MAX_LENGTH = 50;
export const FormDescription = () => {
	const form = useFormContext();
	const description = useWatch({ control: form.control, name: 'description' });

	return (
		<div className="flex flex-col gap-2">
			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="h-5 flex items-center gap-1 text-label-subtle  text-body2 font-semibold">
							정산서 설명
							<span className="text-caption1 font-medium text-label-assistive">(선택)</span>
						</FormLabel>
						<FormControl>
							<textarea
								maxLength={MAX_LENGTH}
								placeholder="ex. OT 회식 1차 -3차 정산서입니다."
								className="px-4 py-3 h-40 rounded-lg font-medium border text-body2 border-line-normal outline-none focus:border-gray-900"
								{...field}
							/>
						</FormControl>
						<p className="flex justify-end text-label-subtle text-caption1 font-medium">
							{description.length}/{MAX_LENGTH}자
						</p>
					</FormItem>
				)}
			/>
		</div>
	);
};
