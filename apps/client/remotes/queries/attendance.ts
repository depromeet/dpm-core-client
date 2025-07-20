import { attendance } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

const QUERY_KEY = 'ATTENDANCE';

export const getAttendanceMeOptions = () =>
	queryOptions({
		queryKey: [QUERY_KEY, 'me'],
		queryFn: () => attendance.getMe(),
		retry: false,
	});

interface getAttendanceMeBySessionIdOptionsParams {
	sessionId: number;
}
export const getAttendanceMeBySessionIdOptions = (
	params: getAttendanceMeBySessionIdOptionsParams,
) =>
	queryOptions({
		queryKey: [QUERY_KEY, 'me', params],
		queryFn: () => attendance.getMeBySessionId(params),
		retry: false,
	});
