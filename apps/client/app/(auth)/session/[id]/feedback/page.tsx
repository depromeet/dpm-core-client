import type { Metadata } from 'next';

import { FeedbackForm } from '../_components/feedback-form';

const FEEDBACK_TITLE = '디프만 세션 피드백';
const FEEDBACK_DESCRIPTION = '이번 세션에 대한 만족도와 의견을 남겨주세요.';
const FEEDBACK_IMAGE = 'https://core.depromeet.com/session-feedback-og.jpg';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: FEEDBACK_TITLE,
		description: FEEDBACK_DESCRIPTION,
		openGraph: {
			title: FEEDBACK_TITLE,
			description: FEEDBACK_DESCRIPTION,
			type: 'website',
			images: [{
				url: FEEDBACK_IMAGE,
				width: 1200,
				height: 600,
				alt: '디프만 19기 세션 피드백',
			}],
		},
		twitter: {
			card: 'summary_large_image',
			title: FEEDBACK_TITLE,
			description: FEEDBACK_DESCRIPTION,
			images: [FEEDBACK_IMAGE],
		},
	};
}

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
