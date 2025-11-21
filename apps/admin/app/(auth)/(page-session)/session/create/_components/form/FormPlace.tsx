'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@dpm-core/shared';

export const FormPlace = () => {
	const form = useFormContext();
	const isOnline = useWatch({ control: form.control, name: 'isOnline' });

	const isDisabled = isOnline === 'online';

	return (
		<div>
			<Label>세션 장소</Label>
			<div className="mt-2 flex gap-2">
				<FormField
					control={form.control}
					name="isOnline"
					render={({ field }) => (
						<FormItem className="w-full">
							<Select
								onValueChange={(v) => {
									if (v === 'online') {
										form.resetField('place');
									}
									field.onChange(v);
								}}
								value={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="online" className="h-9.5">
										온라인
									</SelectItem>
									<SelectItem value="offline" className="h-9.5">
										오프라인
									</SelectItem>
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="place"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Input
									type="text"
									variant="line"
									className="disabled:bg-background-subtle disabled:opacity-100"
									disabled={isDisabled}
									placeholder={!isDisabled ? 'ex. 공덕 창업허브' : '온라인'}
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-red-400" />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
