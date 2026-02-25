import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { AfterPartyDateTimeString } from '@dpm-core/api';

dayjs.extend(utc);

/**
 * API 응답 datetime 파싱 (UTC, Z 없음 → Date)
 * "2026-01-26T05:31:48.588" 형태를 UTC로 해석
 */
export const parseAfterPartyDateTime = (str: AfterPartyDateTimeString): Date => {
	return dayjs.utc(str).toDate();
};

/**
 * API 요청용 datetime 직렬화 (Date → ISO 8601 with Z)
 * "2026-02-25T15:07:29.706Z" 형태로 변환
 */
export const formatAfterPartyDateTimeForRequest = (date: Date): string => {
	return dayjs(date).toISOString();
};

/**
 * API 응답 원본이 변경 없을 때 요청 형식으로 변환
 * "2026-01-26T05:31:48.588" → "2026-01-26T05:31:48.588Z"
 */
export const toRequestFormat = (original: AfterPartyDateTimeString): string => {
	return original.endsWith('Z') ? original : `${original}Z`;
};
