'use client';

import { useNoticeForm } from '@/hooks/use-notice-form';

import { NoticeForm } from '../_components/notice-form';

export default function CreateNoticePage() {
	const { form, handleSubmit, isSubmitPending } = useNoticeForm({ mode: 'create' });

	return (
		<NoticeForm
			mode="create"
			form={form}
			onSubmit={handleSubmit}
			isSubmitPending={isSubmitPending}
			backHref="/notice"
		/>
	);
}
