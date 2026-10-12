import { mutationOptions } from '@tanstack/react-query';
import { type SessionFeedbackSubmissionRequest, session } from '@dpm-core/api';

export type FeedbackSubmissionMockResult = 'success' | 'error';

const isSessionFeedbackSubmissionMockEnabled =
	process.env.NODE_ENV === 'development' &&
	process.env.NEXT_PUBLIC_USE_MOCK_SESSION_FEEDBACK_SUBMISSION !== 'false';

export const submitSessionFeedbackMock = async (
	_payload: SessionFeedbackSubmissionRequest,
	result: FeedbackSubmissionMockResult = 'success',
) => {
	await new Promise((resolve) => window.setTimeout(resolve, 400));

	if (result === 'error') {
		throw new Error('Mock feedback submission failed');
	}
};

export const submitSessionFeedbackOptions = (
	sessionId: number,
	mockResult?: FeedbackSubmissionMockResult,
) =>
	mutationOptions({
		mutationKey: ['session-feedback-submit', sessionId],
		mutationFn: async (params: SessionFeedbackSubmissionRequest) => {
			if (isSessionFeedbackSubmissionMockEnabled) {
				await submitSessionFeedbackMock(params, mockResult);
				return;
			}

			return session.submitFeedback(sessionId, params);
		},
	});
