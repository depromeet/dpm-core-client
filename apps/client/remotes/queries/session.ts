import { session } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

export const getSessionListQuery = queryOptions({
	queryKey: ['session-list'],
	queryFn: session.getList,
});
