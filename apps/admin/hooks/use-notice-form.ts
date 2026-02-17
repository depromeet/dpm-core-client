'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from '@dpm-core/shared';

import { type NoticeSchema, noticeSchema } from '@/app/(auth)/notice/create/_schemas/notice-schema';
import { buildAnnouncementPayload } from '@/app/(auth)/notice/create/_utils/build-announcement-payload';
import { createAnnouncementMutationOptions } from '@/remotes/mutations/announcement';

export const useNoticeForm = (defaultValues?: Partial<NoticeSchema>) => {
	const router = useRouter();

	const { mutate: createAnnouncement, isPending: isSubmitPending } = useMutation(
		createAnnouncementMutationOptions({
			onSuccess: () => {
				toast.success('공지를 등록하였습니다.');
				router.replace('/notice');
			},
			onError: () => {
				toast.error('공지 등록에 실패하였습니다.');
			},
		}),
	);

	const form = useForm<NoticeSchema>({
		resolver: zodResolver(noticeSchema),
		defaultValues: {
			category: 'required',
			assignmentType: 'team',
			title: '',
			content: '',
			submissionLink: '',
			submissionStartDate: undefined,
			submissionStartTime: '0000',
			submissionEndDate: undefined,
			submissionEndTime: '0000',
			isScheduled: false,
			scheduledDate: undefined,
			scheduledTime: '0000',
			sendNotification: false,
			...defaultValues,
		},
	});

	const handleSubmit = (data: NoticeSchema) => {
		const payload = buildAnnouncementPayload(data);
		createAnnouncement(payload);
	};

	const handleTemporarySave = () => {
		const formData = form.getValues();
		console.log('Temporary save:', formData);
		// TODO: 임시저장 API 호출
	};

	return {
		form,
		handleSubmit,
		handleTemporarySave,
		isSubmitPending,
	};
};
