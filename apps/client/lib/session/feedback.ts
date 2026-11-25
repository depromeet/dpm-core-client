import dayjs from 'dayjs';

export const getFeedbackDaysRemaining = (endAt: string, currentTime?: string) =>
	Math.max(1, Math.ceil(dayjs(endAt).diff(dayjs(currentTime), 'hour', true) / 24));
