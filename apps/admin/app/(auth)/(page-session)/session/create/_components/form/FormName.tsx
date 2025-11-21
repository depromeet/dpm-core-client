'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@dpm-core/shared';

export const FormName = () => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="name"
			render={({ field }) => (
				<FormItem>
					<FormLabel>세션명</FormLabel>
					<FormControl>
						<Input variant="line" type="text" placeholder="ex. 디프만 00기 OT" {...field} />
					</FormControl>

					<FormMessage className="text-red-400" />
				</FormItem>
			)}
		/>
	);
};
