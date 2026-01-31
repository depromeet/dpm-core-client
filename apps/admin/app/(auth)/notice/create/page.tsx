'use client';

import Link from 'next/link';
import {
	AppLayout,
	Button,
	ChevronLeft,
	cn,
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

import { TiptapEditorContainer } from './_components/TiptapEditorContainer';

export default function CreateNoticePage() {
	const { form, handleSubmit, handleTemporarySave } = useNoticeForm();

	return (
		<AppLayout className="bg-background-normal">
			{/* 상단 헤더 */}
			<header className="sticky top-0 z-10 border-line-normal border-b bg-background-normal">
				<div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-10 md:py-4">
					<Link href="/notice" className="flex items-center gap-2">
						<ChevronLeft className="text-icon-noraml" />
					</Link>
					<div className="flex items-center gap-2">
						<Button variant="assistive" size="sm">
							임시 0
						</Button>
						<Button variant="assistive" size="sm" onClick={handleTemporarySave}>
							임시저장
						</Button>
						<Button variant="secondary" size="sm" onClick={form.handleSubmit(handleSubmit)}>
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
										<FormLabel>카테고리</FormLabel>
										<FormControl>
											<ToggleGroup
												type="single"
												value={field.value}
												onValueChange={(value) => {
													if (value) field.onChange(value);
												}}
												className="flex gap-2"
											>
												<ToggleGroupItem
													value="required"
													className={cn(
														'rounded-[170px]! border border-line-normal bg-background-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=on]:border-primary-normal data-[state=on]:text-primary-normal',
													)}
												>
													필수
												</ToggleGroupItem>
												<ToggleGroupItem
													value="assignment"
													className={cn(
														'rounded-[170px]! border border-line-normal bg-background-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=on]:border-primary-normal data-[state=on]:text-primary-normal',
													)}
												>
													과제
												</ToggleGroupItem>
												<ToggleGroupItem
													value="other"
													className={cn(
														'rounded-[170px]! border border-line-normal bg-background-normal px-3 py-1 font-medium text-body2 text-label-assistive data-[state=on]:border-primary-normal data-[state=on]:text-primary-normal',
													)}
												>
													기타
												</ToggleGroupItem>
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
										<FormLabel>공지 제목</FormLabel>
										<FormControl>
											<Input placeholder="ex. 디프만 00기 OT" variant="filled" {...field} />
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
										<FormLabel>상세 내용</FormLabel>
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
											<FormLabel>공지 예약하기</FormLabel>
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
												<FormLabel>등록알림 보내기</FormLabel>
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
