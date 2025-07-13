import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export const formatDate = (date: Date | string) => {
	return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

export const formatRelativeTime = (date: Date | string) => {
	return dayjs(date).fromNow();
};

export const formatDateOnly = (date: Date | string) => {
	return dayjs(date).format('YYYY-MM-DD');
};

export const formatTimeOnly = (date: Date | string) => {
	return dayjs(date).format('HH:mm:ss');
};
