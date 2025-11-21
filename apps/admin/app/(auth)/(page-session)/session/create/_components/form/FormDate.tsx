'use client';

import { useState } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CalendarIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
	Button,
	Calendar,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@dpm-core/shared';

import { formatFullDate } from '@/lib/date';

export const FormDate = () => {
	const [open, setOpen] = useState(false);
	const form = useFormContext();

	return (
		<div>
			<Label>세션 시간</Label>
			<div className="mt-2 flex items-start gap-2">
				<FormField
					control={form.control}
					name="sessionDate.date"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel className="sr-only">세션 날짜</FormLabel>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="none"
										id="date"
										className="h-12 justify-between border border-line-normal bg-background-normal p-4 font-medium text-body2"
									>
										{formatFullDate(field.value) || '날짜를 선택해주세요'}
										<CalendarIcon size={20} className="text-icon-noraml" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto overflow-hidden border-line-subtle bg-background-normal p-0 shadow-[0_-4px_21.1px_0_rgba(0,0,0,0.12)]"
									align="end"
								>
									<FormControl>
										<Calendar
											className="px-5 py-3.5"
											mode="single"
											formatters={{
												formatCaption: (date) =>
													date.toLocaleDateString('ko-KR', { month: 'long' }),
											}}
											selected={field.value}
											onSelect={(date) => {
												field.onChange(date);
												setOpen(false);
											}}
											disabled={(date) => date < new Date('1900-01-01')}
										/>
									</FormControl>
								</PopoverContent>
							</Popover>
						</FormItem>
					)}
				/>
				<FormField
					name="sessionDate.time"
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<InputOTP
									pattern={REGEXP_ONLY_DIGITS}
									containerClassName="h-12 rounded-lg border border-line-normal px-4 has-focus:border-gray-900 focus:border-gray-900 disabled:pointer-events-none has-disabled:opacity-100 has-disabled:cursor-not-allowed has-disabled:bg-background-strong has-aria-invalid:border-red-400"
									maxLength={4}
									placeholder="0000"
									{...field}
								>
									<InputOTPGroup>
										<InputOTPSlot
											className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
											index={0}
										/>
										<InputOTPSlot
											className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
											index={1}
										/>
										<p className="mx-1 font-medium text-body2 text-label-assistive">시</p>
										<InputOTPSlot
											className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
											index={2}
										/>
										<InputOTPSlot
											className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
											index={3}
										/>
										<p className="ml-1 font-medium text-body2 text-label-assistive">분 부터</p>
									</InputOTPGroup>
								</InputOTP>
							</FormControl>

							<FormMessage className="text-red-400" />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
