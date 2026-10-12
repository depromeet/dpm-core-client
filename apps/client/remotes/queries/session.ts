import { queryOptions } from '@tanstack/react-query';
import { session } from '@dpm-core/api';

import { MOCK_SESSION_LIST_RESPONSE } from '../mocks/session-list';

const isSessionListMockEnabled =
	process.env.NODE_ENV === 'development' &&
	process.env.NEXT_PUBLIC_USE_MOCK_SESSION_LIST !== 'false';

export const getSessionListQuery = queryOptions({
	queryKey: ['session-list'],
	queryFn: () => (isSessionListMockEnabled ? MOCK_SESSION_LIST_RESPONSE : session.getList()),
});

export const getSessionCurrentOptions = () =>
	queryOptions({
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
