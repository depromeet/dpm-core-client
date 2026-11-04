import dayjs from 'dayjs';

export const showAttendanceBanner = (attendanceStart: string, absentStart: string) => {
	if (!attendanceStart || !absentStart) {
		return false;
	}
	const now = dayjs();
	const start = dayjs(attendanceStart);
	return !now.isBefore(start) && now.isSame(start, 'day');
};
