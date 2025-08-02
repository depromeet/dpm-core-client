import { attendance } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

const QUERY_KEY = 'ATTENDANCE';

export const getAttendanceMeOptions = () =>
	queryOptions({
		queryKey: [QUERY_KEY, 'me'],
		queryFn: async () => {
			try {
				const response = await attendance.getMe();
				return { ...response, isError: false };
			} catch (error) {
				// FIXME: 출석 이력이 없는 경우 처리
				if (error && typeof error === 'object' && 'response' in error) {
					const errorResponse = (await (error as any).response.json()) as {
						code: string;
						message: string;
						status: string;
					};
					if (errorResponse.code === 'ATTENDANCE-404-01') {
						return {
							isError: true,
							...errorResponse,
						};
					}
				}

				throw error;
			}
		},
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
