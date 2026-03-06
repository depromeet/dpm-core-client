import dayjs from 'dayjs';

export const showAttendanceBanner = (attendanceStart: string, lateStart: string) => {
	if (!attendanceStart || !lateStart) {
		return false;
	}
	const now = dayjs();
	return now.isAfter(dayjs(attendanceStart)) && now.isBefore(dayjs(lateStart));
};
