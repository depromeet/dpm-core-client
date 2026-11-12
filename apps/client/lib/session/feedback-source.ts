export type FeedbackEntrySource = 'home' | 'session' | 'shared' | 'unknown';

export const getFeedbackEntrySource = (
	value: string | string[] | undefined,
): FeedbackEntrySource => {
	if (value === 'home' || value === 'session' || value === 'shared') return value;
	return 'unknown';
};
