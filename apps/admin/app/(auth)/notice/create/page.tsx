'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CalendarIcon } from 'lucide-react';
import {
	AppLayout,
	Button,
	Calendar,
	ChevronLeft,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Switch,
	ToggleGroup,
	ToggleGroupItem,
} from '@dpm-core/shared';

import { Section } from '@/components/section';
import { useNoticeForm } from '@/hooks/use-notice-form';
import { usePreventPageExit } from '@/hooks/use-prevent-page-exit';
import { formatDateWithDay } from '@/lib/date';

import { TiptapEditorContainer } from './_components/TiptapEditorContainer';

const CATEGORY_OPTIONS = [
	{ value: 'required', label: '필수' },
	{ value: 'assignment', label: '과제' },
	{ value: 'other', label: '기타' },
] as const;

export default function CreateNoticePage() {
	const router = useRouter();
	const { form, handleSubmit, handleTemporarySave } = useNoticeForm();
	const [scheduledDateOpen, setScheduledDateOpen] = useState(false);

	// form 값 감시
	const title = form.watch('title');
	const content = form.watch('content');
	const isScheduled = form.watch('isScheduled');
	const sendNotification = form.watch('sendNotification');

	// 입력 내용이 하나라도 있으면 페이지 이탈 방지 활성화
	// category는 기본값 'required'이므로 무시
	const hasChanges =
		title.trim() !== '' || content.trim() !== '' || isScheduled || sendNotification;

	usePreventPageExit(hasChanges);

	return (
		<AppLayout className="bg-background-normal">
			{/* 상단 헤더 */}
			<header className="sticky top-0 z-10 border-line-normal border-b bg-background-normal">
				<div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-10 md:py-4">
					<Link
						href="/notice"
						className="flex items-center gap-2"
						onClick={(e) => {
							if (hasChanges) {
								if (!window.confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
									e.preventDefault();
								}
							}
						}}
					>
						<ChevronLeft className="text-icon-noraml" />
					</Link>
					<div className="flex items-center gap-4">
						<Button
							variant="assistive"
							className="h-12"
							onClick={() => {
								const formData = form.getValues();
								const params = new URLSearchParams({
									category: formData.category,
									title: formData.title,
									content: formData.content,
									isScheduled: String(formData.isScheduled),
									sendNotification: String(formData.sendNotification),
								});
								if (formData.isScheduled && formData.scheduledDate != null) {
									params.set('scheduledDate', formData.scheduledDate.toISOString());
									params.set('scheduledTime', formData.scheduledTime ?? '0000');
								}
								router.push(`/notice/create/preview?${params.toString()}`);
							}}
						>
							미리보기
						</Button>
						<Button variant="assistive" className="h-12" onClick={handleTemporarySave}>
							임시저장
						</Button>
						<Button variant="secondary" className="h-12" onClick={form.handleSubmit(handleSubmit)}>
							등록하기
						</Button>
					</div>
				</div>
			</header>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<Section className="mx-auto w-full max-w-[800px] py-8">
						<div className="flex flex-col gap-8">
							{/* 카테고리 */}
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-body1">카테고리</FormLabel>
										<FormControl>
											<ToggleGroup
												type="single"
												value={field.value}
												onValueChange={(value: string) => {
													if (value) field.onChange(value);
												}}
												className="flex gap-2"
											>
												{CATEGORY_OPTIONS.map(({ value, label }) => (
													<ToggleGroupItem
														key={value}
														value={value}
														className="rounded-[170px]! border border-line-normal bg-background-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=on]:border-primary-normal data-[state=on]:text-primary-normal"
													>
														{label}
													</ToggleGroupItem>
												))}
											</ToggleGroup>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							{/* 공지 제목 */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-body1">공지 제목</FormLabel>
										<FormControl>
											<Input placeholder="ex. 디프만 00기 OT" variant="line" {...field} />
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							{/* 상세 내용 */}
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-body1">상세 내용</FormLabel>
										<FormControl>
											<TiptapEditorContainer
												content={field.value}
												onChange={field.onChange}
												placeholder="ex. 디프만 00기 OT"
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							{/* 공지 예약하기 */}
							<div className="flex flex-col gap-2">
								<FormField
									control={form.control}
									name="isScheduled"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center justify-between">
												<FormLabel className="text-body1">공지 예약하기</FormLabel>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</div>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								{isScheduled && (
									<div className="flex items-start gap-2">
									<FormField
										control={form.control}
										name="scheduledDate"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormLabel className="sr-only">예약 날짜</FormLabel>
												<Popover open={scheduledDateOpen} onOpenChange={setScheduledDateOpen}>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="none"
																type="button"
																className="h-12 w-full justify-between border border-line-normal bg-background-normal p-4 font-medium text-body2"
															>
																{field.value ? (
																	formatDateWithDay(field.value)
																) : (
																	<span className="text-label-assistive">
																		{formatDateWithDay(new Date())}
																	</span>
																)}
																<CalendarIcon size={20} className="text-icon-noraml" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto overflow-hidden border-line-subtle bg-background-normal p-0 shadow-[0_-4px_21.1px_0_rgba(0,0,0,0.12)]"
														align="start"
													>
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
																setScheduledDateOpen(false);
															}}
															disabled={(date) => {
																const today = new Date();
																today.setHours(0, 0, 0, 0);
																const d = new Date(date);
																d.setHours(0, 0, 0, 0);
																return d < today;
															}}
														/>
													</PopoverContent>
												</Popover>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="scheduledTime"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormLabel className="sr-only">예약 시간</FormLabel>
												<FormControl>
													<InputOTP
														pattern={REGEXP_ONLY_DIGITS}
														containerClassName="h-12 rounded-lg border border-line-normal px-4 has-focus:border-gray-900 focus:border-gray-900 disabled:pointer-events-none has-disabled:opacity-100 has-disabled:cursor-not-allowed has-disabled:bg-background-strong has-aria-invalid:border-red-400 [&_[data-slot=input-otp-slot]]:text-label-assistive [&_[data-slot=input-otp-slot]:not(:empty)]:text-label-normal"
														maxLength={4}
														placeholder="0000"
														{...field}
													>
														<InputOTPGroup className="gap-0">
															<InputOTPSlot
																className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
																index={0}
															/>
															<InputOTPSlot
																className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
																index={1}
															/>
															<p className="mx-2.5 font-medium text-body2 text-label-assistive">
																시
															</p>
															<InputOTPSlot
																className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
																index={2}
															/>
															<InputOTPSlot
																className="size-2.5 bg-inherit font-medium text-body2 text-label-normal"
																index={3}
															/>
															<p className="ml-2.5 font-medium text-body2 text-label-assistive">
																분
															</p>
															<p className="ml-2.5 font-medium text-body2 text-label-assistive">
																부터
															</p>
														</InputOTPGroup>
													</InputOTP>
												</FormControl>
												<FormMessage className="text-red-400" />
															</FormItem>
										)}
									/>
									</div>
								)}
							</div>

							{/* 등록알림 보내기 */}
							<FormField
								control={form.control}
								name="sendNotification"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between">
											<div className="flex flex-col gap-1">
												<FormLabel className="text-body1">등록알림 보내기</FormLabel>
												<p className="text-body2 text-label-assistive">
													디퍼들에게 공지 등록 PUSH 알림을 보내요
												</p>
											</div>
											<FormControl>
												<Switch checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
										</div>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>
					</Section>
				</form>
			</Form>
		</AppLayout>
	);
}
