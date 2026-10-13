import { queryOptions } from '@tanstack/react-query';
import { http, session } from '@dpm-core/api';

export const getSessionFeedbackMeQuery = (sessionId: number) =>
	queryOptions({
		queryKey: ['session-feedback-me', sessionId],
		queryFn: () => session.getMyFeedbackStatus(sessionId),
		retry: false,
		staleTime: 0,
	});

export const getMyPendingSessionFeedbackQuery = queryOptions({
	queryKey: ['session-feedback-pending'],
	queryFn: () => session.getMyPendingFeedback(),
	enabled: Boolean(http.getDefaultToken()),
	retry: false,
});
