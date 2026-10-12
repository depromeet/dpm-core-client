import dayjs from 'dayjs';
import type { ApiResponse, SessionFeedbackPending } from '@dpm-core/api';

export const MOCK_SESSION_FEEDBACK_PENDING: ApiResponse<SessionFeedbackPending | undefined> = {
	status: 'OK',
	code: 'GLOBAL-200-01',
	message: '요청에 성공했습니다',
	data: {
		sessionId: 37,
		week: 3,
		sessionName: '현직자와의 만남',
		endAt: dayjs().add(72, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
	},
};
