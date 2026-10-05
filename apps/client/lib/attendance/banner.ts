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
	const start = dayjs(attendanceStart);
	return (now.isSame(start) || now.isAfter(start)) && now.isBefore(dayjs(absentStart));
};
