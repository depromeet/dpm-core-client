import dayjs from 'dayjs';

export const formatAttendanceStartTimeToCode = (attendanceStartTime: string) => {
	return dayjs(attendanceStartTime).format('HHmm');
};
