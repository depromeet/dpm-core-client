'use client';

import { useEffect } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useFormContext, useWatch } from 'react-hook-form';
import {
	Divider,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	Label,
} from '@dpm-core/shared';

import { subtractOneMinute } from '../../../_utils';

export const FormAttendancePresentTime = () => {
	const form = useFormContext();

	const lateStartTime = useWatch({
		control: form.control,
		name: 'attendanceLateTime.start',
	}) as string;

	useEffect(() => {
		if (lateStartTime && lateStartTime.length >= 4) {
			form.setValue('attendancePresentTime.end', subtractOneMinute(lateStartTime), {
				shouldTouch: true,
				shouldValidate: true,
			});
		}
	}, [lateStartTime, form]);

	return (
		<div>
			<Label>출석 시간</Label>
			<div className="relative mt-2 flex items-start gap-14">
				<FormField
					name="attendancePresentTime.start"
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel className="sr-only">출석 시작 시간</FormLabel>
							<FormControl>
								<InputOTP
									pattern={REGEXP_ONLY_DIGITS}
									containerClassName="h-12 rounded-lg border border-line-normal px-4 has-focus:border-gray-900 focus:border-gray-900 disabled:pointer-events-none has-disabled:opacity-100 has-disabled:cursor-not-allowed has-disabled:bg-background-strong has-aria-invalid:border-red-400"
									maxLength={4}
									inputMode="numeric"
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
				<div className="-translate-x-1/2 translate-6 absolute left-1/2">
					<Divider className="w-2 bg-gray-400" />
				</div>
				<FormField
					name="attendancePresentTime.end"
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel className="sr-only">출석 종료 시간</FormLabel>
							<FormControl>
								<InputOTP
									disabled
									inputMode="numeric"
									containerClassName="h-12 rounded-lg border border-line-normal px-4 has-focus:border-gray-900 focus:border-gray-900 disabled:pointer-events-none has-disabled:opacity-100 has-disabled:cursor-not-allowed has-disabled:bg-background-strong has-aria-invalid:border-red-400"
									className="disabled:opacity-1"
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
										<p className="ml-1 font-medium text-body2 text-label-assistive">분 까지</p>
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
