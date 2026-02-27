'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@dpm-core/shared';

export const FormPassword = () => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="password"
			render={({ field }) => (
				<FormItem>
					<FormLabel>비밀번호</FormLabel>
					<FormControl>
						<Input variant="line" type="password" placeholder="비밀번호" {...field} />
					</FormControl>
					<div className="relative min-h-4">
						<FormMessage className="text-red-400" />
					</div>
				</FormItem>
			)}
		/>
	);
};
