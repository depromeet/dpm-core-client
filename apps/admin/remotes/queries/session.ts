import { queryOptions } from '@tanstack/react-query';
import { session } from '@dpm-core/api';

export const getSessionListQuery = queryOptions({
	queryKey: ['session-list'],
	queryFn: () => session.getList(),
});

export const getCurrentWeekSessionQuery = queryOptions({
	queryKey: ['session-current-week'],
	queryFn: () => session.getCurrentWeekSession(),
});

export const getSessionDetailQuery = (sessionId: number) =>
	queryOptions({
		queryKey: ['session-detail', sessionId],
		queryFn: () => session.getSessionById(sessionId),
	});

export const getSessionFeedbackInsightQuery = (sessionId: number) =>
	queryOptions({
		queryKey: ['session-feedback-insight', sessionId],
		queryFn: () => session.getFeedbackInsight(sessionId),
		refetchInterval: (query) => (query.state.data?.data.status === 'IN_PROGRESS' ? 5_000 : false),
	});

export const getSessionWeeks = () =>
	queryOptions({
		queryKey: ['sessions, weeks'],
		queryFn: () => session.getSessionWeeks(),
	});
