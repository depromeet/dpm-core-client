import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const REGEXP_HHMM = /^([0-1][0-9]|2[0-3])[0-5][0-9]$/;
export const TIME_RANGE_ERROR_MESSAGE = '시간은 00~23시, 00~59분으로 입력해주세요.';

export const subtractOneMinute = (time: string) => {
	return dayjs(time, 'HHmm').subtract(1, 'm').format('HHmm');
};

export const plusOneMinute = (time: string) => {
	return dayjs(time, 'HHmm').add(1, 'm').format('HHmm');
};
