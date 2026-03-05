'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from '@dpm-core/shared';

import { type NoticeSchema, noticeSchema } from '@/app/(auth)/notice/create/_schemas/notice-schema';
import { buildAnnouncementPayload } from '@/app/(auth)/notice/create/_utils/build-announcement-payload';
import {
	createAnnouncementMutationOptions,
	updateAnnouncementMutationOptions,
} from '@/remotes/mutations/announcement';

interface UseNoticeFormOptions {
	mode?: 'create' | 'edit';
	announcementId?: number;
	defaultValues?: Partial<NoticeSchema>;
}

export const useNoticeForm = (options: UseNoticeFormOptions = {}) => {
	const { mode = 'create', announcementId, defaultValues } = options;
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate: createAnnouncement, isPending: isCreatePending } = useMutation(
		createAnnouncementMutationOptions({
			onSuccess: () => {
				toast.success('공지를 등록하였습니다.');
				queryClient.invalidateQueries({ queryKey: ['announcement-list'] });
				router.replace('/notice');
			},
			onError: () => {
				toast.error('공지 등록에 실패하였습니다.');
			},
		}),
	);

	const { mutate: updateAnnouncement, isPending: isUpdatePending } = useMutation(
		updateAnnouncementMutationOptions({
			onSuccess: () => {
				toast.success('공지를 수정하였습니다.');
				queryClient.invalidateQueries({ queryKey: ['announcement-list'] });
				if (announcementId) {
					queryClient.invalidateQueries({
						queryKey: ['announcement-detail', announcementId],
					});
				}
				router.replace('/notice');
			},
			onError: () => {
				toast.error('공지 수정에 실패하였습니다.');
			},
		}),
	);

	const isSubmitPending = mode === 'edit' ? isUpdatePending : isCreatePending;

	const form = useForm<NoticeSchema>({
		resolver: zodResolver(noticeSchema),
		defaultValues: {
			category: 'required',
			assignmentType: 'team',
			title: '',
			content: '',
			submissionLink: '',
			submissionStartDate: undefined,
			submissionStartTime: '',
			submissionEndDate: undefined,
			submissionEndTime: '',
			isScheduled: false,
			scheduledDate: undefined,
			scheduledTime: '',
			sendNotification: false,
			...defaultValues,
		},
	});

	const handleSubmit = (data: NoticeSchema) => {
		const payload = buildAnnouncementPayload(data);

		if (mode === 'edit' && announcementId) {
			updateAnnouncement({ announcementId, body: payload });
		} else {
			createAnnouncement(payload);
		}
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
