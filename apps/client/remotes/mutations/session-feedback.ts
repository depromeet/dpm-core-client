import { mutationOptions } from '@tanstack/react-query';
import { type SessionFeedbackSubmissionRequest, session } from '@dpm-core/api';

export const submitSessionFeedbackOptions = (sessionId: number) =>
	mutationOptions({
		mutationKey: ['session-feedback-submit', sessionId],
		mutationFn: (params: SessionFeedbackSubmissionRequest) =>
			session.submitFeedback(sessionId, params),
	});
