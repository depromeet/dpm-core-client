import dayjs from 'dayjs';

export const getFeedbackDaysRemaining = (endAt: string) =>
	Math.max(1, Math.ceil(dayjs(endAt).diff(dayjs(), 'hour', true) / 24));
