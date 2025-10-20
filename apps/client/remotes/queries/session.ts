import { queryOptions } from '@tanstack/react-query';
import { session } from '@dpm-core/api';

export const getSessionListQuery = queryOptions({
	queryKey: ['session-list'],
	queryFn: session.getList,
});

export const getSessionCurrentOptions = () =>
	queryOptions({
		queryKey: ['session-current-week'],
		queryFn: async () => {
			return session.getCurrentWeekSession();
		},
	});

export const getSessionAttendanceTimeOptions = (sessionId: number) =>
	queryOptions({
		queryKey: ['sessions', 'attendance-time'],
		queryFn: () => session.getSessionAttendanceTime(sessionId),
		retry: false,
	});
