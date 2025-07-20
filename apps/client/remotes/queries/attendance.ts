import { attendance } from '@dpm-core/api';
import { useSuspenseQuery } from '@tanstack/react-query';

const QUERY_KEY = 'ATTENDANCE_QUERY_KEY';

export const useGetAttandanceMe = () => {
	return useSuspenseQuery({
		queryKey: [QUERY_KEY, 'ME'],
		queryFn: () => attendance.getMe(),
	});
};

export const useGetAttandanceMeBySessionId = (params: { sessionId: number }) => {
	return useSuspenseQuery({
		queryKey: [QUERY_KEY, 'ME', params],
		queryFn: () => attendance.getMeBySessionId(params),
	});
};
