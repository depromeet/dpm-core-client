'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@dpm-core/shared';

export const FormEmail = () => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="signupEmail"
			render={({ field }) => (
				<FormItem>
					<FormLabel>디프만 지원 이메일</FormLabel>
					<FormControl>
						<Input variant="line" type="text" placeholder="디프만 지원 이메일" {...field} />
					</FormControl>
					<div className="relative min-h-4">
						<FormMessage className="text-red-400" />
					</div>
				</FormItem>
			)}
		/>
	);
};
