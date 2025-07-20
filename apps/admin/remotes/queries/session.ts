import { session } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

export const getSessionListQuery = queryOptions({
	queryKey: ['session-list'],
	queryFn: session.getList,
});

export const getCurrentWeekSessionQuery = queryOptions({
	queryKey: ['session-current-week'],
	queryFn: async () => {
		return session.getCurrentWeekSession();
	},
});

export const getSessionDetailQuery = (sessionId: number) =>
	queryOptions({
		queryKey: ['session-detail', sessionId],
		queryFn: async () => {
			return session.getSessionById(sessionId);
		},
	});
