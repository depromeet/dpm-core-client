export const SESSION_FEEDBACK_STATUSES = [
	'AVAILABLE',
	'SUBMITTED',
	'EXPIRED',
	'NOT_TARGET',
] as const;

export type SessionFeedbackStatus = (typeof SESSION_FEEDBACK_STATUSES)[number];

export interface SessionFeedbackStatusResponse {
	sessionId: number;
	status: SessionFeedbackStatus;
}

export const getSessionFeedbackStatusMock = async (
	sessionId: number,
	status: SessionFeedbackStatus = 'AVAILABLE',
): Promise<SessionFeedbackStatusResponse> => ({ sessionId, status });
