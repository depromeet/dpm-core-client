import dayjs from 'dayjs';

/** closedAt 기준으로 남은 일수 계산 */
export const getDaysUntilDeadline = (closedAt: string): number => {
	return dayjs(closedAt).diff(dayjs(), 'day');
};
