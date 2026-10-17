import dayjs from 'dayjs';

/**
 * 목록 갱신 시각 표기.
 * 하루 이내는 "{n}시간 전", 일주일 이내는 "{n}일 전", 그 이후는 날짜로 보여준다.
 */
export function formatLastUpdated(lastUpdatedAt?: string | null): string | null {
	if (!lastUpdatedAt) return null;

	const updated = dayjs(lastUpdatedAt);
	if (!updated.isValid()) return null;

	const now = dayjs();
	const diffHours = now.diff(updated, 'hour');

	if (diffHours < 1) return '방금 전';
	if (diffHours < 24) return `${diffHours}시간 전`;

	const diffDays = now.diff(updated, 'day');
	if (diffDays <= 7) return `${diffDays}일 전`;

	return updated.format('YYYY.MM.DD');
}
