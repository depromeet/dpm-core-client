import z from 'zod';

/** HTML 태그 제거 후 실제 텍스트가 있는지 확인 (Tiptap 빈 에디터는 <p></p> 등 반환) */
const hasContentText = (html: string) => html.replace(/<[^>]*>/g, '').replace(/\s/g, '').length > 0;

/** 링크(URL) 형식 검사 */
const urlSchema = z
	.string()
	.optional()
	.refine((val) => !val || val === '' || /^https?:\/\//.test(val), {
		message: '링크 타입으로 입력해주세요!',
	});

export const noticeSchema = z
	.object({
		category: z.enum(['required', 'assignment', 'other']),
		assignmentType: z.enum(['team', 'individual']).optional(),
		title: z.string().min(1, '공지 제목을 입력해주세요!'),
		content: z.string().refine(hasContentText, { message: '공지 내용을 입력해주세요!' }),
		submissionLink: urlSchema,
		submissionStartDate: z.date().optional(),
		submissionStartTime: z.string().optional(),
		submissionEndDate: z.date().optional(),
		submissionEndTime: z.string().optional(),
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
	)
	.refine(
		(data) => {
			if (data.category !== 'assignment') return true;
			return (
				data.submissionStartDate != null &&
				data.submissionStartTime != null &&
				data.submissionStartTime.length === 4 &&
				data.submissionEndDate != null &&
				data.submissionEndTime != null &&
				data.submissionEndTime.length === 4
			);
		},
		{
			message: '제출 기한을 입력해주세요!',
			path: ['submissionStartDate'],
		},
	);

export type NoticeSchema = z.infer<typeof noticeSchema>;
