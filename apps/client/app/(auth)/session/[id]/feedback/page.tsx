import { FeedbackForm } from '../_components/feedback-form';

export default async function SessionFeedbackPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
	const [{ id }, { returnTo }] = await Promise.all([params, searchParams]);
	const feedbackReturnTo = returnTo === '/' ? '/' : '/session';

	return (
		<FeedbackForm sessionId={Number(id)} sessionTitle="OT & 팀빌딩" returnTo={feedbackReturnTo} />
	);
}
