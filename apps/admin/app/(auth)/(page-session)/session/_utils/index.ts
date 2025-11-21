import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const subtractOneMinute = (time: string) => {
	return dayjs(time, 'HHmm').subtract(1, 'm').format('HHmm');
};

export const plusOneMinute = (time: string) => {
	return dayjs(time, 'HHmm').add(1, 'm').format('HHmm');
};
