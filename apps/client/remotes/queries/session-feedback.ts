import { queryOptions } from '@tanstack/react-query';
import {
	type ApiResponse,
	type SessionFeedbackMeResponse,
	type SessionFeedbackMyStatus,
	session,
} from '@dpm-core/api';

import { MOCK_SESSION_LIST_RESPONSE } from '../mocks/session-list';

export const SESSION_FEEDBACK_STATUSES: SessionFeedbackMyStatus[] = [
	'AVAILABLE',
	'BEFORE_START',
	'SUBMITTED',
	'EXPIRED',
	'NOT_TARGET',
];

const isSessionFeedbackStatusMockEnabled =
	process.env.NODE_ENV === 'development' &&
	process.env.NEXT_PUBLIC_USE_MOCK_SESSION_FEEDBACK_STATUS !== 'false';

export const getSessionFeedbackMeMock = (
	sessionId: number,
	myStatus: SessionFeedbackMyStatus = 'AVAILABLE',
): ApiResponse<SessionFeedbackMeResponse> => {
	const sessionName =
		MOCK_SESSION_LIST_RESPONSE.data.sessions.find((item) => item.id === sessionId)?.name ?? '세션';

	return {
		status: 'OK',
		code: 'GLOBAL-200-01',
		message: '요청에 성공했습니다',
		data: {
			sessionName,
			myStatus,
			startAt: myStatus === 'BEFORE_START' ? '2026-10-10T18:00:00' : null,
		},
	};
};

export const getSessionFeedbackMeQuery = (
	sessionId: number,
	mockStatus?: SessionFeedbackMyStatus,
) =>
	queryOptions({
		queryKey: ['session-feedback-me', sessionId, mockStatus],
		queryFn: () =>
			isSessionFeedbackStatusMockEnabled
				? getSessionFeedbackMeMock(sessionId, mockStatus)
				: session.getMyFeedbackStatus(sessionId),
		retry: false,
		staleTime: 0,
	});
