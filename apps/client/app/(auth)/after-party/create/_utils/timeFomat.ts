import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

/** 날짜 포맷 함수 */
export const afterPartyFormatDate = (date: Date | string) => {
	return dayjs(date).format('YY년 MM월 DD일 (ddd)');
};

/** 시간 포맷 함수 */
export const afterPartyFormatTime = (date: Date | string) => {
	return dayjs(date).format('A h시');
};
