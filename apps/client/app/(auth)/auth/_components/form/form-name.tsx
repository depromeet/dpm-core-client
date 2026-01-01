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
					<FormLabel>이름</FormLabel>
					<FormControl>
						<Input
							variant="line"
							type="text"
							placeholder="이름(실명 입력)"
							autoComplete="name"
							{...field}
						/>
					</FormControl>
					<div className="relative min-h-4">
						<FormMessage className="text-red-400" />
					</div>
				</FormItem>
			)}
		/>
	);
};
