import dayjs from 'dayjs';

export const showAttendanceBanner = (
	attendanceStart: string,
	lateStart: string,
	absentStart: string,
) => {
	if (!attendanceStart || !lateStart || !absentStart) {
		return false;
	}
	const now = dayjs();
	return now.isAfter(dayjs(attendanceStart)) && now.isBefore(dayjs(absentStart));
};
