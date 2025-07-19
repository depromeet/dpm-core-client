import dayjs from 'dayjs';
import { ATTENDANCE_GAP_DURATION, ATTENDANCE_LATE_DURATION } from '@/constants/attendance';

export const SESSION_ATTENDANCE_TIME = 30;

export const calcSessionAttendanceTime = (attendanceStartTime: string) =>
	dayjs(new Date(attendanceStartTime).getTime() + ATTENDANCE_GAP_DURATION);

export const calcSessionLateAttendanceTime = (attendanceStartTime: string) =>
	dayjs(new Date(attendanceStartTime).getTime() + ATTENDANCE_LATE_DURATION);
