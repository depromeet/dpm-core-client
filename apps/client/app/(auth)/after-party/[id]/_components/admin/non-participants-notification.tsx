'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
	Button,
	type ButtonProps,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from '@dpm-core/shared';

const notificationSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, '알림 제목은 필수 입력입니다.')
		.max(20, '알림 제목은 최대 20자까지 입력할 수 있습니다.'),
	content: z
		.string()
		.trim()
		.min(1, '알림 내용은 필수 입력입니다.')
		.max(30, '알림 내용은 최대 30자까지 입력할 수 있습니다.'),
});

const FORM_ID = 'notification-form';

export type NotificationSchema = z.infer<typeof notificationSchema>;

interface NonParticipantsNotificationProps {
	size: ButtonProps['size'];
}

export const NonParticipantsNotification = (props: NonParticipantsNotificationProps) => {
	const { size } = props;
	const form = useForm<NotificationSchema>({
		resolver: zodResolver(notificationSchema),
		defaultValues: { title: '', content: '' },
	});

	const handleNonParticipationNotification = (formData: NotificationSchema) => {
		console.log(formData);
	};

	const title = form.watch('title');
	const content = form.watch('content');

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="secondary" size={size} className="w-full">
					미투표자 리마인드 보내기
				</Button>
			</DrawerTrigger>
			<DrawerContent className="mx-auto max-w-lg">
				<DrawerHeader className="mb-8">
					<DrawerTitle>미참여자 리마인드 보내기</DrawerTitle>
				</DrawerHeader>
				<Form {...form}>
					<form
						id={FORM_ID}
						onSubmit={form.handleSubmit(handleNonParticipationNotification)}
						className="mb-2.5 flex flex-col gap-3 px-6"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>알림 제목</FormLabel>
									<FormControl>
										<Input variant="line" type="text" placeholder="알림 제목" {...field} />
									</FormControl>
									<div className="relative flex min-h-4 items-center">
										<FormMessage className="text-red-400" />
										<span className="absolute top-0 right-0 font-medium text-caption1 text-label-subtle">
											{title.length}/{20}자
										</span>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>알림 내용</FormLabel>
									<FormControl>
										<textarea
											placeholder="알림 내용"
											className="h-40 rounded-lg border border-line-normal px-4 py-3 font-medium text-body2 outline-none focus:border-gray-900"
											{...field}
										/>
									</FormControl>
									<div className="relative flex min-h-4 items-center">
										<FormMessage className="text-red-400" />
										<span className="absolute top-0 right-0 font-medium text-caption1 text-label-subtle">
											{content.length}/{30}자
										</span>
									</div>
								</FormItem>
							)}
						/>
						<p className="font-medium text-body2 text-label-subtle">
							참여 조사에 응답하지 않은 디퍼들에게는 알림이 발송돼요.
							<br />
							발송 후에는 수정이 불가능하니, 꼭 한 번 더 확인해 주세요.
						</p>
					</form>
					<DrawerFooter className="flex-row">
						<Button
							variant="none"
							size="none"
							className="flex items-center rounded-lg bg-background-strong p-3.5"
							onClick={() => form.reset()}
						>
							<RotateCw className="size-5 text-gray-400" />
						</Button>
						<Button form={FORM_ID} type="submit" variant="secondary" size="lg" className="flex-1">
							보내기
						</Button>
					</DrawerFooter>
				</Form>
			</DrawerContent>
		</Drawer>
	);
};
