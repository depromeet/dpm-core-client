'use client';

import { zodResolver } from '@hookform/resolvers/zod';
// import * as motion from 'motion/react-client';
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
	GAPageTracker,
	Input,
	Label,
} from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

// import { useScrollVisibility } from '../_hooks/useScrollVisibility';

/** 폼 스키마 정의 */
const createGatheringSchema = z.object({
	/** 회식 이름 (필수, 1-20자) */
	title: z
		.string()
		.min(1, '회식 이름을 입력해주세요')
		.max(20, '회식 이름은 20자 이내로 입력해주세요'),
	/** 회식 설명 (선택, 최대 500자) */
	description: z.string().max(500, '회식 설명은 500자 이내로 입력해주세요').optional(),
	/** 회식 초대 범위 */
	inviteScopes: z.array(z.string()).min(1, '초대 범위를 선택해주세요'),
	/** 회식 시간 */
	scheduledAt: z.date().optional(),
	/** 참여 조사 마감 시간 */
	closedAt: z.date().optional(),
	/** 참여 조사 마감 후 수정 허용 */
	allowEditAfterClose: z.boolean(),
});

type CreateGatheringFormValues = z.infer<typeof createGatheringSchema>;

const StaffTogetherCreatePage = () => {
	// const { isVisible: showButton } = useScrollVisibility({ delay: 300 });

	const form = useForm<CreateGatheringFormValues>({
		resolver: zodResolver(createGatheringSchema),
		defaultValues: {
			title: '',
			description: '',
			inviteScopes: [],
			allowEditAfterClose: false,
		},
	});

	const titleValue = form.watch('title');
	const descriptionValue = form.watch('description') ?? '';

	const handleSubmit = (data: CreateGatheringFormValues) => {
		console.log('Form submitted:', data);
		// TODO: API 호출 및 확인 Drawer 열기
	};

	return (
		<AppLayout className="h-[100dvh] bg-white">
			{/* <AppLayout className="bg-white"> */}
			<GAPageTracker type="staff-together-create" />
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
							render={({ field }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">
										회식 설명 <span className="font-medium text-[#9CA3AF]">(선택)</span>
									</Label>
									<FormControl>
										<textarea
											{...field}
											className={cn(
												'flex min-h-[120px] w-full resize-none rounded-lg border border-line-normal bg-white p-4 font-medium text-body2 outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-gray-900',
											)}
											placeholder="ex. 17기 OT 회식"
											maxLength={500}
										/>
									</FormControl>
									<p className="text-right font-medium text-[#4B5563] text-caption1">
										{descriptionValue.length} / 500자
									</p>
								</FormItem>
							)}
						/>

						{/* 회식 초대 범위 - 2단계에서 구현 */}
						<FormField
							control={form.control}
							name="inviteScopes"
							render={() => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">회식 초대 범위</Label>
									<div className="flex min-h-[48px] w-full items-center rounded-lg border border-line-normal bg-white p-4">
										{/* TODO: 태그 입력 컴포넌트 */}
									</div>
								</FormItem>
							)}
						/>

						{/* 회식 시간 - 3단계에서 구현 */}
						<FormField
							control={form.control}
							name="scheduledAt"
							render={({ field }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">회식 시간</Label>
									<div className="flex gap-[8px]">
										<button
											type="button"
											className="flex flex-1 items-center gap-[8px] rounded-lg border border-line-normal bg-white px-[16px] py-[12px]"
										>
											<CalendarIcon />
											<span className="font-medium text-[#1F2937] text-body2">
												{field.value ? formatDate(field.value) : '날짜 선택'}
											</span>
										</button>
										<button
											type="button"
											className="flex items-center gap-[8px] rounded-lg border border-line-normal bg-white px-[16px] py-[12px]"
										>
											<ClockIcon />
											<span className="font-medium text-[#1F2937] text-body2">
												{field.value ? formatTime(field.value) : '시간 선택'}
											</span>
										</button>
									</div>
								</FormItem>
							)}
						/>

						{/* 참여 조사 마감 시간 - 4단계에서 구현 */}
						<FormField
							control={form.control}
							name="closedAt"
							render={({ field }) => (
								<FormItem>
									<Label className="font-semibold text-[#4B5563] text-body2">
										참여 조사 마감 시간
									</Label>
									<div className="flex gap-[8px]">
										<button
											type="button"
											className="flex flex-1 items-center gap-[8px] rounded-lg border border-line-normal bg-white px-[16px] py-[12px]"
										>
											<CalendarIcon />
											<span className="font-medium text-[#1F2937] text-body2">
												{field.value ? formatDate(field.value) : '날짜 선택'}
											</span>
										</button>
										<button
											type="button"
											className="flex items-center gap-[8px] rounded-lg border border-line-normal bg-white px-[16px] py-[12px]"
										>
											<ClockIcon />
											<span className="font-medium text-[#1F2937] text-body2">
												{field.value ? formatTime(field.value) : '시간 선택'}
											</span>
										</button>
									</div>
								</FormItem>
							)}
						/>

						{/* 참여 조사 마감 후 수정 허용 - 5단계에서 구현 */}
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
				<Button
					type="submit"
					variant="secondary"
					size="full"
					className="h-[48px] rounded-lg bg-[#1F2937] text-white"
					onClick={form.handleSubmit(handleSubmit)}
				>
					회식 생성하기
				</Button>
			</div>
			{/* <motion.div
				className="pointer-events-none fixed bottom-0 w-full max-w-lg px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))]"
				initial={{ y: '100%' }}
				animate={{ y: showButton ? 0 : '100%' }}
				transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
			>
				<Button
					type="submit"
					variant="secondary"
					size="full"
					className="pointer-events-auto h-[48px] rounded-lg bg-[#1F2937] text-white"
					onClick={form.handleSubmit(handleSubmit)}
				>
					회식 생성하기
				</Button>
			</motion.div> */}
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

/** 날짜 포맷 함수 */
const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
	return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
};

/** 시간 포맷 함수 */
const formatTime = (date: Date) => {
	const hours = date.getHours();
	const period = hours < 12 ? '오전' : '오후';
	const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
	return `${period} ${displayHours}시`;
};

export default StaffTogetherCreatePage;
