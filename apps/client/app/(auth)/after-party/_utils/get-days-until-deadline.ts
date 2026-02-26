import dayjs from 'dayjs';

import { parseAfterPartyDateTime } from './datetime';

/** closedAt 기준으로 남은 일수 계산 */
export const getDaysUntilDeadline = (closedAt: string): number => {
	return dayjs(parseAfterPartyDateTime(closedAt)).diff(dayjs(), 'day');
};
