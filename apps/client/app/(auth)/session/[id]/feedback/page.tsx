import { FeedbackForm } from '../_components/feedback-form';

export default async function SessionFeedbackPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		returnTo?: string | string[];
	}>;
}) {
	const [{ id }, { returnTo }] = await Promise.all([params, searchParams]);
	const sessionId = Number(id);
	const feedbackReturnTo = returnTo === '/' ? '/' : '/session';

	return <FeedbackForm sessionId={sessionId} returnTo={feedbackReturnTo} />;
}
