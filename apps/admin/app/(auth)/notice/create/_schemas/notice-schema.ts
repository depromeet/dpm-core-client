import z from 'zod';

export const noticeSchema = z
	.object({
		category: z.enum(['required', 'assignment', 'other']),
		title: z.string().min(1, '공지 제목을 입력해주세요.'),
		content: z.string().min(1, '상세 내용을 입력해주세요.'),
		isScheduled: z.boolean(),
		scheduledDate: z.date().optional(),
		scheduledTime: z.string().optional(), // HHMM 4자리
		sendNotification: z.boolean(),
	})
	.refine(
		(data) => {
			if (!data.isScheduled) return true;
			return (
				data.scheduledDate != null && data.scheduledTime != null && data.scheduledTime.length === 4
			);
		},
		{ message: '예약일시를 선택해주세요.', path: ['scheduledDate'] },
	);

export type NoticeSchema = z.infer<typeof noticeSchema>;
