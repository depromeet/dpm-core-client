'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
// import { useMutation } from '@tanstack/react-query';
// import * as motion from 'motion/react-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	AppLayout,
	Button,
	cn,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	GAPageTracker,
	Input,
	Label,
	toast,
} from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { createAfterPartyOptions } from '@/remotes/mutations/after-party';
import { getInviteTagsQueryOptions } from '@/remotes/queries/after-party';

import { DateTimePickerDrawer } from './_components/datetime-picker-drawer';
import { ReviewBottomSheet } from './_components/review-bottom-sheet';
import { TagSelect } from './_components/tag-select';
import { afterPartyFormatDate, afterPartyFormatTime } from './_utils/timeFomat';

// import { useScrollVisibility } from '../_hooks/useScrollVisibility';

/** 폼 스키마 정의 */
const createGatheringSchema = z
	.object({
		/** 회식 이름 (필수, 1-20자) */
		title: z
			.string()
			.min(1, '회식 이름을 입력해주세요')
			.max(20, '회식 이름은 20자 이내로 입력해주세요'),
		/** 회식 설명 (선택, 최대 500자) */
		description: z.string().max(500, '회식 설명은 500자 이내로 입력해주세요').optional(),
		/** 회식 초대 범위 (형식: cohortId-authorityId, 1개 이상 필수) */
		inviteScopes: z
			.array(z.string().regex(/^\d+-\d+$/, '올바른 초대 범위 형식이 아닙니다'))
			.min(1, '초대 범위를 1개 이상 선택해주세요')
			.refine(
				(arr) =>
					arr.every((id) => {
						const [cohortId, authorityId] = id.split('-').map(Number);
						return cohortId > 0 && authorityId > 0;
					}),
				'선택한 초대 범위가 올바르지 않습니다',
			),
		/** 회식 시간 (현재 시각 이후만 허용) */
		scheduledAt: z
			.date()
			.optional()
			.refine((val) => val !== undefined, '회식 날짜를 선택해주세요')
			.refine(
				(val) => val !== undefined && dayjs(val).isAfter(dayjs()),
				'회식 시간은 현재 시각 이후로 선택해주세요',
			),
		/** 참여 조사 마감 시간 (현재 시각 이후, 회식 시간 이전) */
		closedAt: z
			.date()
			.optional()
			.refine((val) => val !== undefined, '참여 조사 마감 시간을 선택해주세요'),
		/** 참여 조사 마감 후 수정 허용 */
		allowEditAfterClose: z.boolean(),
	})
	.superRefine((data, ctx) => {
		if (data.closedAt && !dayjs(data.closedAt).isAfter(dayjs())) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: '참여 조사 마감 시간은 현재 시각 이후로 선택해주세요',
				path: ['closedAt'],
			});
		}
		if (
			data.closedAt &&
			data.scheduledAt &&
			!dayjs(data.closedAt).isBefore(dayjs(data.scheduledAt))
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: '참여 조사 마감 시간은 회식 시간 이전으로 선택해주세요',
				path: ['closedAt'],
			});
		}
	});

type CreateGatheringFormValues = z.infer<typeof createGatheringSchema>;

const STORAGE_KEY = 'after-party-create-form';

/** InviteTag를 TagSelect options 형식으로 변환 (id: cohortId-authorityId) */
const mapInviteTagsToOptions = (
	inviteTags: { cohortId: number; authorityId: number; tagName: string }[],
) =>
	inviteTags.map((t) => ({
		id: `${t.cohortId}-${t.authorityId}`,
		label: t.tagName,
	}));

const AfterPartyCreatePage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const { data: inviteTagsData, isLoading: isInviteTagsLoading } =
		useQuery(getInviteTagsQueryOptions);
	const inviteScopeOptions = inviteTagsData?.data?.inviteTags
		? mapInviteTagsToOptions(inviteTagsData.data.inviteTags)
		: [];

	const form = useForm<CreateGatheringFormValues>({
		resolver: zodResolver(createGatheringSchema),
		defaultValues: {
			title: '',
			description: '',
			inviteScopes: [],
			allowEditAfterClose: false,
		},
	});

	const { mutate: createAfterParty, isPending } = useMutation(
		createAfterPartyOptions({
			onSuccess: () => {
				sessionStorage.removeItem(STORAGE_KEY);
				queryClient.invalidateQueries({ queryKey: ['after-parties'] });
				router.replace('/after-party/create/complete');
			},
			onError: () => {
				toast.error('회식 생성에 실패했습니다.');
			},
		}),
	);

	// sessionStorage: ?new=1이면 초기화(새로 생성), 없으면 복원(새로고침)
	useEffect(() => {
		const isNewCreation = searchParams.get('new') === '1';

		if (isNewCreation) {
			sessionStorage.removeItem(STORAGE_KEY);
			router.replace('/after-party/create');
			return;
		}

		const saved = sessionStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (parsed.scheduledAt) {
					parsed.scheduledAt = dayjs(parsed.scheduledAt).toDate();
				}
				if (parsed.closedAt) {
					parsed.closedAt = dayjs(parsed.closedAt).toDate();
				}
				form.reset(parsed);
			} catch {
				// 파싱 실패 시 무시
			}
		}
	}, [form, router, searchParams]);

	// 폼 데이터가 변경될 때마다 sessionStorage에 저장
	useEffect(() => {
		const subscription = form.watch((data) => {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		});
		return () => subscription.unsubscribe();
	}, [form]);

	const titleValue = form.watch('title');
	const descriptionValue = form.watch('description') ?? '';
	const scheduledAtValue = form.watch('scheduledAt');

	const handleSubmit = (data: CreateGatheringFormValues) => {
		const inviteTags = data.inviteScopes.map((id) => {
			const [cohortId, authorityId] = id.split('-').map(Number);
			return { cohortId, authorityId };
		});
		const payload = {
			title: data.title,
			description: data.description ?? '',
			inviteTags,
			scheduledAt: data.scheduledAt ? dayjs(data.scheduledAt).toISOString() : '',
			closedAt: data.closedAt ? dayjs(data.closedAt).toISOString() : '',
			allowEditAfterClose: data.allowEditAfterClose,
			canEditAfterApproval: false,
		};
		createAfterParty(payload);
	};

	return (
		<AppLayout className="h-[100dvh] bg-white">
			{/* <AppLayout className="bg-white"> */}
			<GAPageTracker type="after-party-create" />
			<AppHeader title="회식 생성하기" className="shrink-0" />
			{/* <AppHeader title="회식 생성하기" className="mb-1.5" /> */}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex flex-1 flex-col overflow-y-auto px-[16px] pt-1.5 pb-[24px]"
					// className="flex flex-1 flex-col px-[16px] pb-[100px]"
				>
					{/* 기본 정보 섹션 */}
					<section className="space-y-[24px]">
						<h2 className="font-semibold text-[#111827] text-title2">기본 정보</h2>

						{/* 회식 이름 */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">회식이름</Label>
									<FormControl>
										<Input
											{...field}
											variant="line"
											placeholder="ex. 17기 OT 회식"
											maxLength={20}
										/>
									</FormControl>
									<FormMessage className="font-medium text-caption1 text-red-500" />
									<p className="text-right font-medium text-[#4B5563] text-caption1">
										{titleValue.length} / 20자
									</p>
								</FormItem>
							)}
						/>

						{/* 회식 설명 */}
						<FormField
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">
										회식 설명 <span className="font-medium text-[#9CA3AF]">(선택)</span>
									</Label>
									<FormControl>
										<textarea
											{...field}
											className={cn(
												'flex min-h-[120px] w-full resize-none rounded-lg border bg-white p-4 font-medium text-body2 outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-gray-900',
												fieldState.error ? 'border-red-400' : 'border-line-normal',
											)}
											placeholder="ex. 17기 OT 회식"
											maxLength={500}
										/>
									</FormControl>
									<FormMessage className="font-medium text-caption1 text-red-500" />
									<p className="text-right font-medium text-[#4B5563] text-caption1">
										{descriptionValue.length} / 500자
									</p>
								</FormItem>
							)}
						/>

						{/* 회식 초대 범위 */}
						<FormField
							control={form.control}
							name="inviteScopes"
							render={({ field, fieldState }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">회식 초대 범위</Label>
									<FormControl>
										{isInviteTagsLoading ? (
											<div
												className={cn(
													'min-h-[48px] animate-pulse rounded-lg border border-line-normal bg-[#F3F4F6]',
													fieldState.error && '!border-red-400',
												)}
											/>
										) : (
											<TagSelect
												value={field.value}
												onChange={field.onChange}
												options={inviteScopeOptions}
												placeholder="초대 범위를 선택해주세요"
												className={fieldState.error ? '!border-red-400' : undefined}
											/>
										)}
									</FormControl>
									<FormMessage className="font-medium text-caption1 text-red-500" />
								</FormItem>
							)}
						/>

						{/* 회식 시간 */}
						<FormField
							control={form.control}
							name="scheduledAt"
							render={({ field, fieldState }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">회식 시간</Label>
									<FormMessage className="font-medium text-caption1 text-red-500" />
									<div className="flex gap-[8px]">
										<DateTimePickerDrawer
											title="회식 시간"
											value={field.value}
											onChange={field.onChange}
											minDateTime={dayjs().toDate()}
										>
											<button
												type="button"
												className={cn(
													'flex flex-1 items-center gap-[8px] rounded-lg border bg-white px-[16px] py-[12px]',
													fieldState.error ? 'border-red-400' : 'border-line-normal',
												)}
											>
												<CalendarIcon />
												<span className="font-medium text-[#1F2937] text-body2">
													{field.value ? afterPartyFormatDate(field.value) : '날짜 선택'}
												</span>
											</button>
										</DateTimePickerDrawer>
										<DateTimePickerDrawer
											title="회식 시간"
											value={field.value}
											onChange={field.onChange}
											minDateTime={dayjs().toDate()}
										>
											<button
												type="button"
												className={cn(
													'flex items-center gap-[8px] rounded-lg border bg-white px-[16px] py-[12px]',
													fieldState.error ? 'border-red-400' : 'border-line-normal',
												)}
											>
												<ClockIcon />
												<span className="font-medium text-[#1F2937] text-body2">
													{field.value ? afterPartyFormatTime(field.value) : '시간 선택'}
												</span>
											</button>
										</DateTimePickerDrawer>
									</div>
								</FormItem>
							)}
						/>

						{/* 참여 조사 마감 시간 */}
						<FormField
							control={form.control}
							name="closedAt"
							render={({ field, fieldState }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">
										참여 조사 마감 시간
									</Label>
									<FormMessage className="font-medium text-caption1 text-red-500" />
									<div className="flex gap-[8px]">
										<DateTimePickerDrawer
											title="참여 조사 마감 일시"
											value={field.value}
											onChange={field.onChange}
											selectedLabel="마감"
											highlightedDate={scheduledAtValue}
											highlightedLabel="회식"
											minDateTime={dayjs().toDate()}
										>
											<button
												type="button"
												className={cn(
													'flex flex-1 items-center gap-[8px] rounded-lg border bg-white px-[16px] py-[12px]',
													fieldState.error ? 'border-red-400' : 'border-line-normal',
												)}
											>
												<CalendarIcon />
												<span className="font-medium text-[#1F2937] text-body2">
													{field.value ? afterPartyFormatDate(field.value) : '날짜 선택'}
												</span>
											</button>
										</DateTimePickerDrawer>
										<DateTimePickerDrawer
											title="참여 조사 마감 일시"
											value={field.value}
											onChange={field.onChange}
											selectedLabel="마감"
											highlightedDate={scheduledAtValue}
											highlightedLabel="회식"
											minDateTime={dayjs().toDate()}
										>
											<button
												type="button"
												className={cn(
													'flex items-center gap-[8px] rounded-lg border bg-white px-[16px] py-[12px]',
													fieldState.error ? 'border-red-400' : 'border-line-normal',
												)}
											>
												<ClockIcon />
												<span className="font-medium text-[#1F2937] text-body2">
													{field.value ? afterPartyFormatTime(field.value) : '시간 선택'}
												</span>
											</button>
										</DateTimePickerDrawer>
									</div>
								</FormItem>
							)}
						/>

						{/* 참여 조사 마감 후 수정 허용 */}
						<FormField
							control={form.control}
							name="allowEditAfterClose"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-start justify-between gap-[24px]">
										<div className="space-y-[4px]">
											<Label className="font-semibold text-[#4B5563] text-body2">
												참여 조사 마감 후 수정 허용
											</Label>
											<p className="font-medium text-[#9CA3AF] text-caption1">
												마감 이후에도 참석 여부를 수정할 수 있어요.
												<br />
												변경 시 푸시 알림으로 알려드려요.
											</p>
										</div>
										<button
											type="button"
											role="switch"
											aria-checked={field.value}
											onClick={() => field.onChange(!field.value)}
											className={cn(
												'relative h-[22px] w-[42px] shrink-0 rounded-full p-[2px] shadow-xs transition-colors',
												field.value ? 'bg-[#1F2937]' : 'bg-[#E5E7EB]',
											)}
										>
											<span
												className={cn(
													'block h-[18px] w-[18px] rounded-full bg-white transition-transform',
													field.value ? 'translate-x-[20px]' : 'translate-x-0',
												)}
											/>
										</button>
									</div>
								</FormItem>
							)}
						/>
					</section>
				</form>
			</Form>

			{/* 하단 CTA 버튼 */}
			<div className="before:-top-[24px] relative shrink-0 bg-white px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))] before:pointer-events-none before:absolute before:right-0 before:left-0 before:h-[24px] before:bg-gradient-to-t before:from-white before:to-transparent">
				<ReviewBottomSheet
					data={{
						title: form.watch('title'),
						description: form.watch('description'),
						scheduledAt: form.watch('scheduledAt'),
						closedAt: form.watch('closedAt'),
						inviteScopes: form.watch('inviteScopes'),
					}}
					inviteScopeOptions={inviteScopeOptions}
					onConfirm={() => form.handleSubmit(handleSubmit)()}
					isPending={isPending}
				>
					<Button
						type="button"
						variant="secondary"
						size="full"
						className="h-[48px] rounded-lg bg-[#1F2937] text-white"
						disabled={isPending}
					>
						회식 생성하기
					</Button>
				</ReviewBottomSheet>
			</div>
		</AppLayout>
	);
};

/** 캘린더 아이콘 */
const CalendarIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5872 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5872 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M13.3333 1.66666V4.99999"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M6.66669 1.66666V4.99999"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M2.5 8.33334H17.5"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/** 시계 아이콘 */
const ClockIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66666 10 1.66666C5.39765 1.66666 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10 5V10L13.3333 11.6667"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default AfterPartyCreatePage;
