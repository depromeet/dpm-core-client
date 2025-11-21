import { queryOptions } from '@tanstack/react-query';
import { type SessionAttendanceStatusTime, session } from '@dpm-core/api';

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

export const getSessionWeeks = () =>
	queryOptions({
		queryKey: ['sessions, weeks'],
		queryFn: async () => {
			return session.getSessionWeeks();
		},
	});

export const getSessionModifyPolicyQuery = (
	params: { sessionId: number } & SessionAttendanceStatusTime,
) => {
	const { sessionId, ...searchParams } = params;
	return queryOptions({
		queryKey: ['session-policy', sessionId],
		queryFn: async () => session.getSessionModifyPolicy({ sessionId, ...searchParams }),
	});
};
