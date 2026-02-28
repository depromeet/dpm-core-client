'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
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
import { useAuth } from '@/providers/auth-provider';
import { updateAfterPartyOptions } from '@/remotes/mutations/after-party';
import { getAfterPartyByIdQueryOptions } from '@/remotes/queries/after-party';

import {
	formatAfterPartyDateTimeForRequest,
	parseAfterPartyDateTime,
	toRequestFormat,
} from '../../../_utils/datetime';
import { DateTimePickerDrawer } from '../../../create/_components/datetime-picker-drawer';
import { afterPartyFormatDate, afterPartyFormatTime } from '../../../create/_utils/timeFomat';

/** 폼 스키마 정의 (inviteScopes 제외 - 수정 불가) */
const gatheringSchema = z
	.object({
		title: z
			.string()
			.min(1, '회식 이름을 입력해주세요')
			.max(20, '회식 이름은 20자 이내로 입력해주세요'),
		description: z.string().max(500, '회식 설명은 500자 이내로 입력해주세요').optional(),
		scheduledAt: z
			.date()
			.optional()
			.refine((val) => val !== undefined, '회식 날짜를 선택해주세요')
			.refine(
				(val) => val !== undefined && dayjs(val).isAfter(dayjs()),
				'회식 시간은 현재 시각 이후로 선택해주세요',
			),
		closedAt: z
			.date()
			.optional()
			.refine((val) => val !== undefined, '참여 조사 마감 시간을 선택해주세요'),
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

type GatheringFormValues = z.infer<typeof gatheringSchema>;

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

interface AfterPartyUpdateFormProps {
	gatheringId: number;
}

const AfterPartyUpdateForm = ({ gatheringId }: AfterPartyUpdateFormProps) => {
	const { user } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();
	const {
		data: { data: detail },
	} = useSuspenseQuery(getAfterPartyByIdQueryOptions(gatheringId));

	// 어드민만 수정 폼 접근 가능 (실제 수정 가능 여부는 API에서 검증)
	const canEdit = user?.isAdmin;

	// API 원본 문자열 보존 (타임존 변환 없이 그대로 전송하기 위함)
	const originalScheduledAt = detail.scheduledAt;
	const originalClosedAt = detail.closedAt;

	const form = useForm<GatheringFormValues>({
		resolver: zodResolver(gatheringSchema),
		defaultValues: {
			title: detail.title,
			description: detail.description ?? '',
			scheduledAt: parseAfterPartyDateTime(detail.scheduledAt),
			closedAt: parseAfterPartyDateTime(detail.closedAt),
			allowEditAfterClose: false,
		},
	});

	// 서버 데이터로 폼 초기화
	useEffect(() => {
		form.reset({
			title: detail.title,
			description: detail.description ?? '',
			scheduledAt: parseAfterPartyDateTime(detail.scheduledAt),
			closedAt: parseAfterPartyDateTime(detail.closedAt),
			allowEditAfterClose: false,
		});
	}, [detail, form]);

	const { mutate: updateAfterParty, isPending } = useMutation(
		updateAfterPartyOptions({
			onSuccess: () => {
				toast.success('수정 완료했어요');
				queryClient.invalidateQueries({ queryKey: ['after-parties'] });
				queryClient.invalidateQueries({ queryKey: ['after-party', gatheringId] });
				router.replace('/after-party');
			},
			onError: (error) => {
				console.error('Error updating after party:', error);
			},
		}),
	);

	// 수정 불가 시 목록으로 리다이렉트
	useEffect(() => {
		if (!canEdit) {
			router.replace('/after-party');
		}
	}, [canEdit, router]);

	const titleValue = form.watch('title');
	const descriptionValue = form.watch('description') ?? '';
	const scheduledAtValue = form.watch('scheduledAt');

	const handleSubmit = (data: GatheringFormValues) => {
		const inviteTags =
			detail.inviteTags?.inviteTags?.map((t) => ({
				cohortId: t.cohortId,
				authorityId: t.authorityId,
			})) ?? [];

		// 변경 없을 때 원본 문자열을 요청 형식으로 변환 (Z 추가)
		const originalScheduledAtTime = parseAfterPartyDateTime(originalScheduledAt).getTime();
		const originalClosedAtTime = parseAfterPartyDateTime(originalClosedAt).getTime();
		const scheduledAtUnchanged =
			data.scheduledAt && data.scheduledAt.getTime() === originalScheduledAtTime;
		const closedAtUnchanged = data.closedAt && data.closedAt.getTime() === originalClosedAtTime;

		const payload = {
			title: data.title,
			description: data.description ?? '',
			scheduledAt:
				scheduledAtUnchanged && originalScheduledAt
					? toRequestFormat(originalScheduledAt)
					: data.scheduledAt
						? formatAfterPartyDateTimeForRequest(data.scheduledAt)
						: '',
			closedAt:
				closedAtUnchanged && originalClosedAt
					? toRequestFormat(originalClosedAt)
					: data.closedAt
						? formatAfterPartyDateTimeForRequest(data.closedAt)
						: '',
			isApproved: false,
			authorMemberId: detail.authorMemberId,
			canEditAfterApproval: data.allowEditAfterClose,
			inviteTags,
		};
		console.log('[회식 수정] payload:', payload);
		updateAfterParty({ gatheringId, params: payload });
	};

	if (!canEdit) {
		return null;
	}

	return (
		<AppLayout className="h-[100dvh] bg-white">
			<GAPageTracker type="after-party-update" />
			<AppHeader title="회식 수정하기" backHref="/after-party" className="shrink-0" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex flex-1 flex-col overflow-y-auto px-[16px] pt-1.5 pb-[24px]"
				>
					<section className="space-y-[24px]">
						<h2 className="font-semibold text-[#111827] text-title2">기본 정보</h2>

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

						<div>
							<Label className="font-semibold text-[#4B5563] text-body2">
								회식 초대 범위 <span className="font-medium text-[#9CA3AF]">(수정 불가)</span>
							</Label>
							<div className="mt-2 flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg border border-line-normal bg-[#F9FAFB] px-3 py-2">
								{detail.inviteTags?.inviteTags && detail.inviteTags.inviteTags.length > 0 ? (
									detail.inviteTags.inviteTags.map((t) => (
										<span
											key={`${t.cohortId}-${t.authorityId}`}
											className="inline-flex rounded-md bg-gray-200 px-2 py-1 font-medium text-[#4B5563] text-caption1"
										>
											@ {t.tagName}
										</span>
									))
								) : (
									<span className="font-medium text-[#9CA3AF] text-body2">초대 범위 정보 없음</span>
								)}
							</div>
						</div>

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

			<div className="relative shrink-0 bg-white px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))]">
				<Button
					type="button"
					variant="secondary"
					size="full"
					className="h-[48px] rounded-lg bg-[#1F2937] text-white"
					disabled={isPending}
					onClick={() => form.handleSubmit(handleSubmit)()}
				>
					수정하기
				</Button>
			</div>
		</AppLayout>
	);
};

export { AfterPartyUpdateForm };
