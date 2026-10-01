import { FeedbackForm } from '../_components/feedback-form';

export default async function SessionFeedbackPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		returnTo?: string | string[];
		mockFeedbackSubmission?: string | string[];
	}>;
}) {
	const [{ id }, { returnTo, mockFeedbackSubmission }] = await Promise.all([params, searchParams]);
	const feedbackReturnTo = returnTo === '/' ? '/' : '/session';
	const mockSubmissionResult =
		process.env.NODE_ENV === 'development' &&
		(mockFeedbackSubmission === 'error' || mockFeedbackSubmission === 'success')
			? mockFeedbackSubmission
			: undefined;

	return (
		<FeedbackForm
			sessionId={Number(id)}
			sessionTitle="OT & 팀빌딩"
			returnTo={feedbackReturnTo}
			mockSubmissionResult={mockSubmissionResult}
		/>
	);
}
