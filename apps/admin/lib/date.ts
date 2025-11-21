import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

/**
 * @param isoString ISO 8601 형식의 날짜 문자열
 * @returns 완전한 날짜 문자열 (예: 2025년 07월 09일 (화) 10:00)
 * @example
 * formatISOStringToFullDateString('2025-07-09T10:00:00.000Z') // 2025년 07월 09일 (화) 10:00
 */
export const formatISOStringToFullDateString = (isoString: string | null) => {
	if (!isoString) {
		return '-';
	}
	return dayjs(isoString).format('YYYY년 MM월 DD일 (ddd) HH:mm');
};

/**
 * @param isoString ISO 8601 형식의 날짜 문자열
 * @returns 컴팩트한 날짜 문자열 (예: 2025-07-09 ddd요일)
 * @example
 * formatISOStringToCompactDateString('2025-07-09T10:00:00.000Z') // 2025-07-09 화요일
 */
export const formatISOStringToCompactDateString = (isoString: string) => {
	return dayjs(isoString).format('YYYY-MM-DD ddd요일');
};

/**
 * @param isoString ISO 8601 형식의 날짜 문자열
 * @returns 시간 문자열 (예: 10:00)
 * @example
 * formatISOStringHHMM('2025-07-09T10:00:00.000Z') // 10:00
 */
export const formatISOStringHHMM = (isoString: string) => {
	return dayjs(isoString).format('HH:mm');
};

export const formatFullDate = (isoString: string) => {
	if (!isoString) {
		return '-';
	}

	return dayjs(isoString).format('YYYY년 MM월 DD일 (ddd)');
};

export const formatISOStringToDate = (isoString: string) => {
	if (!isoString) {
		return '-';
	}

	return dayjs(isoString).format('YYYY년 MM월 DD일 (ddd)');
};
