export interface SessionFeedbackSubmission {
	sessionId: number;
	satisfaction: number;
	positiveReasons: string[];
	improvementReasons: string[];
	comment: string;
}

export type FeedbackSubmissionMockResult = 'success' | 'error';

export const submitSessionFeedbackMock = async (
	_payload: SessionFeedbackSubmission,
	result: FeedbackSubmissionMockResult = 'success',
) => {
	await new Promise((resolve) => window.setTimeout(resolve, 400));

	if (result === 'error') {
		throw new Error('Mock feedback submission failed');
	}
};
