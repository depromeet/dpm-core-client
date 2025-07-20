import { attendance } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

const QUERY_KEY = 'ATTENDANCE';

export const getAttandanceMeOptions = () =>
	queryOptions({
		queryKey: [QUERY_KEY, 'me'],
		queryFn: () => attendance.getMe(),
		retry: false,
	});

interface getAttandanceMeBySessionIdOptionsParams {
	sessionId: number;
}
export const getAttandanceMeBySessionIdOptions = (
	params: getAttandanceMeBySessionIdOptionsParams,
) =>
	queryOptions({
		queryKey: [QUERY_KEY, 'me', params],
		queryFn: () => attendance.getMeBySessionId(params),
		retry: false,
	});
