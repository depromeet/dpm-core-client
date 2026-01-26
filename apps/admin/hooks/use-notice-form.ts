'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type NoticeSchema, noticeSchema } from '@/app/(auth)/notice/create/_schemas/notice-schema';

export const useNoticeForm = (defaultValues?: Partial<NoticeSchema>) => {
	const form = useForm<NoticeSchema>({
		resolver: zodResolver(noticeSchema),
		defaultValues: {
			category: 'required',
			title: '',
			content: '',
			isScheduled: false,
			sendNotification: false,
			...defaultValues,
		},
	});

	const handleSubmit = (data: NoticeSchema) => {
		console.log('Form submitted:', data);
		// TODO: API 호출
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
	};
};
