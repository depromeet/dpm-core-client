import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

/**
 * @param isoString ISO 8601 형식의 날짜 문자열
 * @returns 완전한 날짜 문자열 (예: 2025년 07월 09일 (화) 10:00)
 * @example
 * formatISOStringToFullDateString('2025-07-09T10:00:00.000Z') // 2025년 07월 09일 (화) 10:00
 */
export const formatISOStringToFullDateString = (isoString: string) => {
	return dayjs(isoString).format('YYYY년 MM월 DD일 (ddd) HH:mm');
};
