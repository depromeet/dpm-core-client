import z from 'zod';

/** HTML 태그 제거 후 실제 텍스트가 있는지 확인 (Tiptap 빈 에디터는 <p></p> 등 반환) */
const hasContentText = (html: string) =>
	html.replace(/<[^>]*>/g, '').replace(/\s/g, '').length > 0;

export const noticeSchema = z
	.object({
		category: z.enum(['required', 'assignment', 'other']),
		title: z.string().min(1, '공지 제목을 입력해주세요!'),
		content: z.string().refine(hasContentText, { message: '공지 내용을 입력해주세요!' }),
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
		{ message: '예약일을 입력해주세요!', path: ['scheduledDate'] },
	);

export type NoticeSchema = z.infer<typeof noticeSchema>;
