'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@dpm-core/shared';

export const FormWeek = () => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="week"
			render={({ field }) => (
				<FormItem>
					<FormLabel>세션 주차</FormLabel>
					<FormControl>
						<Input
							placeholder="ex. 1"
							className="border border-line-normal bg-inherit"
							{...field}
						/>
					</FormControl>

					<FormMessage className="text-red-400" />
				</FormItem>
			)}
		/>
	);
};
