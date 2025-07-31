import dayjs from 'dayjs';

export const showAttendanceCodeBanner = (date: string) => {
	if (!date) return false;

	const now = dayjs();
	const sessionDate = dayjs(date);

	const diffInDays = sessionDate.startOf('day').diff(now.startOf('day'), 'day');

	return diffInDays >= 0 && diffInDays <= 2;
};

export const showAttendanceBanner = (date: string) => {
	if (!date) return false;

	const now = dayjs();
	const sessionDate = dayjs(date);

	return sessionDate.isSame(now, 'day');
};
