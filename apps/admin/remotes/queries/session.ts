import { queryOptions } from '@tanstack/react-query';
import { type SessionAttendanceStatusTime, session } from '@dpm-core/api';

import { isAdminDevMockEnabled } from '@/lib/dev-mock-auth';
import {
	createMockCurrentWeekSessionResponse,
	createMockSessionDetailResponse,
	createMockSessionListResponse,
	createMockSessionWeeksResponse,
} from '@/lib/dev-mock-session';
import { createMockSessionFeedbackInsightResponse } from '@/lib/dev-mock-session-feedback';

export const getSessionListQuery = queryOptions({
	queryKey: ['session-list'],
	queryFn: () => (isAdminDevMockEnabled() ? createMockSessionListResponse() : session.getList()),
});

export const getCurrentWeekSessionQuery = queryOptions({
	queryKey: ['session-current-week'],
	queryFn: async () => {
		if (isAdminDevMockEnabled()) return createMockCurrentWeekSessionResponse();
		return session.getCurrentWeekSession();
	},
});

export const getSessionDetailQuery = (sessionId: number) =>
	queryOptions({
		queryKey: ['session-detail', sessionId],
		queryFn: async () => {
			if (isAdminDevMockEnabled()) return createMockSessionDetailResponse(sessionId);
			return session.getSessionById(sessionId);
		},
	});

export const getSessionFeedbackInsightQuery = (sessionId: number) =>
	queryOptions({
		queryKey: ['session-feedback-insight', sessionId],
		queryFn: () =>
			isAdminDevMockEnabled()
				? createMockSessionFeedbackInsightResponse(sessionId)
				: session.getFeedbackInsight(sessionId),
		refetchInterval: (query) => (query.state.data?.data.status === 'IN_PROGRESS' ? 5_000 : false),
	});

export const getSessionWeeks = () =>
	queryOptions({
		queryKey: ['sessions, weeks'],
		queryFn: async () => {
			if (isAdminDevMockEnabled()) return createMockSessionWeeksResponse();
			return session.getSessionWeeks();
		},
	});

export const getSessionModifyPolicyQuery = (
	params: { sessionId: number } & SessionAttendanceStatusTime,
) => {
	return queryOptions({
		queryKey: ['session-policy', params],
		queryFn: async () => session.getSessionModifyPolicy(params),
	});
};
