'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CalendarIcon } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
	Button,
	Calendar,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	koLocale,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Switch,
} from '@dpm-core/shared';

import { formatDateWithDay } from '@/lib/date';

import type { SessionSchema } from '../SessionForm';

export const FormFeedbackSettings = ({
	feedbackSettingsLocked = false,
}: {
	feedbackSettingsLocked?: boolean;
}) => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const form = useFormContext<SessionSchema>();
	const feedbackEnabled = useWatch({ control: form.control, name: 'feedbackEnabled' });
	const feedbackStartDate = useWatch({ control: form.control, name: 'feedbackStartAt.date' });
	const feedbackStartTime = useWatch({ control: form.control, name: 'feedbackStartAt.time' });
	const hasValidStart = feedbackStartDate && /^([01]\d|2[0-3])[0-5]\d$/.test(feedbackStartTime);
	const feedbackEndAt = hasValidStart
		? dayjs(feedbackStartDate)
				.hour(Number(feedbackStartTime.slice(0, 2)))
				.minute(Number(feedbackStartTime.slice(2, 4)))
				.add(72, 'hour')
				.format('YYYY.MM.DD HH:mm')
		: '';

	return (
		<section className="flex flex-col gap-10">
			<FormField
				control={form.control}
				name="feedbackEnabled"
				render={({ field }) => (
					<FormItem>
						<div className="flex items-center justify-between">
							<FormLabel className="font-semibold text-title2">피드백 받기</FormLabel>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={feedbackSettingsLocked}
									className="h-[22px] w-[42px] rounded-[12px] border-0 bg-background-heavy p-[2px] data-[state=checked]:bg-background-inverse data-[state=unchecked]:bg-background-heavy [&>span]:size-[18px] [&>span]:shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
								/>
							</FormControl>
						</div>
						{feedbackSettingsLocked && (
							<p className="text-caption1 text-label-assistive">
								피드백 수집이 시작되어 수집 여부와 시작 시간은 변경할 수 없어요.
							</p>
						)}
					</FormItem>
				)}
			/>

			{feedbackEnabled && (
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-2">
						<Label>피드백 시작 시간</Label>
						<div className="flex items-start gap-2">
							<FormField
								control={form.control}
								name="feedbackStartAt.date"
								render={({ field }) => (
									<FormItem className="flex-1">
										<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="none"
													className="h-12 w-full justify-between border border-line-normal bg-background-normal p-4 font-medium text-body2"
													aria-label="피드백 시작 날짜 선택"
													disabled={feedbackSettingsLocked}
												>
													{field.value ? formatDateWithDay(field.value) : '날짜를 선택해주세요'}
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
														locale={koLocale}
														selected={field.value ?? undefined}
														onSelect={(date) => {
															field.onChange(date ?? null);
															setIsCalendarOpen(false);
														}}
													/>
												</FormControl>
											</PopoverContent>
										</Popover>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="feedbackStartAt.time"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<InputOTP
												pattern={REGEXP_ONLY_DIGITS}
												disabled={feedbackSettingsLocked}
												containerClassName="h-12 rounded-lg border border-line-normal px-4 has-focus:border-gray-900 focus:border-gray-900 has-aria-invalid:border-red-400"
												maxLength={4}
												inputMode="numeric"
												placeholder="0000"
												{...field}
											>
												<InputOTPGroup>
													<InputOTPSlot
														className="size-2.5 bg-inherit font-medium text-body2"
														index={0}
													/>
													<InputOTPSlot
														className="size-2.5 bg-inherit font-medium text-body2"
														index={1}
													/>
													<p className="mx-1 font-medium text-body2 text-label-assistive">시</p>
													<InputOTPSlot
														className="size-2.5 bg-inherit font-medium text-body2"
														index={2}
													/>
													<InputOTPSlot
														className="size-2.5 bg-inherit font-medium text-body2"
														index={3}
													/>
													<p className="ml-1 font-medium text-body2 text-label-assistive">분</p>
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<FormField
						control={form.control}
						name="feedbackPushEnabled"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<div className="flex flex-col gap-1">
										<FormLabel>피드백 알림 보내기</FormLabel>
										<p className="text-caption1 text-label-assistive">
											피드백 시작 시간에 참여자에게 PUSH 알림을 보내요.
										</p>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											className="h-[22px] w-[42px] rounded-[12px] border-0 bg-background-heavy p-[2px] data-[state=checked]:bg-background-inverse data-[state=unchecked]:bg-background-heavy [&>span]:size-[18px] [&>span]:shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
										/>
									</FormControl>
								</div>
							</FormItem>
						)}
					/>

					<div className="flex flex-col gap-2">
						<Label>피드백 종료 시간</Label>
						<Input
							variant="line"
							disabled
							className="bg-background-subtle text-label-assistive disabled:opacity-100"
							value={
								feedbackEndAt
									? `수집 시작 3일 후 자동 마감 (${feedbackEndAt})`
									: '수집 시작 시간 입력 후 자동 계산'
							}
							readOnly
						/>
					</div>
				</div>
			)}
		</section>
	);
};
