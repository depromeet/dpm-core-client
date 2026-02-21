'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	AppLayout,
	Button,
	ChevronLeft,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Switch,
	ToggleGroup,
	ToggleGroupItem,
} from '@dpm-core/shared';

import { Section } from '@/components/section';
import { useNoticeForm } from '@/hooks/use-notice-form';
import { usePreventPageExit } from '@/hooks/use-prevent-page-exit';

import { TiptapEditorContainer } from './_components/TiptapEditorContainer';

const CATEGORY_OPTIONS = [
	{ value: 'required', label: '필수' },
	{ value: 'assignment', label: '과제' },
	{ value: 'other', label: '기타' },
] as const;

export default function CreateNoticePage() {
	const router = useRouter();
	const { form, handleSubmit, handleTemporarySave } = useNoticeForm();

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
						onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
