import { session } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

export const getSessionListQuery = queryOptions({
	queryKey: ['session-list'],
	queryFn: session.getList,
});

export const getSessionAttendanceTimeOptions = (sessionId: number) =>
	queryOptions({
		queryKey: ['sessions', 'attendance-time'],
		queryFn: () => session.getSessionAttendanceTime(sessionId),
		retry: false,
	});
