'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@dpm-core/shared';
import { useFormContext, useWatch } from 'react-hook-form';

const MAX_LENGTH = 20;

export const FormTitle = () => {
	const form = useFormContext();
	const title = useWatch({ control: form.control, name: 'title' });

	return (
		<div className="flex flex-col gap-2">
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="h-5 flex items-center text-label-subtle  text-body2 font-semibold">
							정산서 이름
						</FormLabel>
						<FormControl>
							<Input
								maxLength={MAX_LENGTH}
								type="text"
								placeholder="ex. 17기 OT 회식"
								className="bg-inherit border border-line-normal"
								{...field}
							/>
						</FormControl>
						<div className="flex items-center relative min-h-4">
							<FormMessage />
							<span className="absolute top-0 right-0 text-label-subtle  text-caption1 font-medium ">
								{title.length}/{MAX_LENGTH}자
							</span>
						</div>
					</FormItem>
				)}
			/>
		</div>
	);
};
