import z from 'zod';

export const noticeSchema = z.object({
	category: z.enum(['required', 'assignment', 'other']),
	title: z.string().min(1, '공지 제목을 입력해주세요.'),
	content: z.string().min(1, '상세 내용을 입력해주세요.'),
	isScheduled: z.boolean(),
	sendNotification: z.boolean(),
});

export type NoticeSchema = z.infer<typeof noticeSchema>;
