import dayjs from 'dayjs';
import {
	ATTENDANCE_GAP_DURATION,
	ATTENDANCE_LATE_DURATION,
	ONE_MINUTE,
} from '@/constants/attendance';

export const SESSION_ATTENDANCE_TIME = 30;

export const calcSessionAttendanceTime = (attendanceStartTime: string) =>
	dayjs(new Date(attendanceStartTime).getTime() + ATTENDANCE_GAP_DURATION - ONE_MINUTE);

export const calcSessionLateAttendanceTime = (attendanceStartTime: string) =>
	dayjs(
		new Date(attendanceStartTime).getTime() + ATTENDANCE_GAP_DURATION + ATTENDANCE_LATE_DURATION,
	);

export const calcSessionAttendanceTimeByHHmmToISOString = (
	attendanceStartTime: string,
	inputAttendanceStartTime: string,
) => {
	const hours = Number(inputAttendanceStartTime.slice(0, 2));
	const minutes = Number(inputAttendanceStartTime.slice(2));

	const updatedAttendanceStartTime = dayjs(attendanceStartTime)
		.hour(hours)
		.minute(minutes)
		.second(0)
		.millisecond(0)
		.format('YYYY-MM-DDTHH:mm:ss');

	return updatedAttendanceStartTime;
};
