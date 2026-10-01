import { FeedbackForm } from '../_components/feedback-form';

export default async function SessionFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return <FeedbackForm sessionId={Number(id)} sessionTitle="OT & 팀빌딩" />;
}
