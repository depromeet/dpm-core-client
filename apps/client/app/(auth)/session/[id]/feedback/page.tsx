import type { SessionFeedbackMyStatus } from '@dpm-core/api';

import { SESSION_FEEDBACK_STATUSES } from '@/remotes/queries/session-feedback';

import { FeedbackForm } from '../_components/feedback-form';

export default async function SessionFeedbackPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		returnTo?: string | string[];
		mockFeedbackSubmission?: string | string[];
		mockFeedbackStatus?: string | string[];
	}>;
}) {
	const [{ id }, { returnTo, mockFeedbackSubmission, mockFeedbackStatus }] = await Promise.all([
		params,
		searchParams,
	]);
	const sessionId = Number(id);
	const feedbackReturnTo = returnTo === '/' ? '/' : '/session';
	const mockSubmissionResult =
		process.env.NODE_ENV === 'development' &&
		(mockFeedbackSubmission === 'error' || mockFeedbackSubmission === 'success')
			? mockFeedbackSubmission
			: undefined;
	const normalizedMockFeedbackStatus =
		typeof mockFeedbackStatus === 'string' ? mockFeedbackStatus.toUpperCase() : undefined;
	const requestedStatus =
		process.env.NODE_ENV === 'development' &&
		SESSION_FEEDBACK_STATUSES.includes(normalizedMockFeedbackStatus as SessionFeedbackMyStatus)
			? (normalizedMockFeedbackStatus as SessionFeedbackMyStatus)
			: undefined;

	return (
		<FeedbackForm
			sessionId={sessionId}
			returnTo={feedbackReturnTo}
			mockSubmissionResult={mockSubmissionResult}
			mockFeedbackStatus={requestedStatus}
		/>
	);
}
