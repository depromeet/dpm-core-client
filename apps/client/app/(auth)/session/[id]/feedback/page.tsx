import {
	getSessionFeedbackStatusMock,
	SESSION_FEEDBACK_STATUSES,
	type SessionFeedbackStatus,
} from '@/remotes/queries/session-feedback';

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
		SESSION_FEEDBACK_STATUSES.includes(normalizedMockFeedbackStatus as SessionFeedbackStatus)
			? (normalizedMockFeedbackStatus as SessionFeedbackStatus)
			: 'AVAILABLE';
	const feedbackStatus = await getSessionFeedbackStatusMock(sessionId, requestedStatus);

	return (
		<FeedbackForm
			sessionId={sessionId}
			sessionTitle="OT & 팀빌딩"
			returnTo={feedbackReturnTo}
			mockSubmissionResult={mockSubmissionResult}
			feedbackStatus={feedbackStatus.status}
		/>
	);
}
