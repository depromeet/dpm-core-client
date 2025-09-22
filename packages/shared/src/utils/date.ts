import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ATTENDANCE_GAP_DURATION, ATTENDANCE_LATE_DURATION } from '../constants/attendance';

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
	return dayjs(date).format('HH:mm');
};

export const formatDotFullDate = (date: Date | string) => {
	return dayjs(date).format('YYYY.MM.DD (ddd)');
};

export const calcSessionAttendanceTime = (attendanceStartTime: string) =>
	dayjs(new Date(attendanceStartTime).getTime() + ATTENDANCE_GAP_DURATION);

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

export const formatAttendanceTimeFromCode = (timeCode: string) => {
	return `${timeCode.slice(0, 2)}:${timeCode.slice(2, 4)}`;
};

export const calculateLateTimeFromStartTime = (startTimeCode: string) => {
	const totalMinutes = parseInt(startTimeCode.slice(0, 2)) * 60 + parseInt(startTimeCode.slice(2, 4)) + 35;
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
