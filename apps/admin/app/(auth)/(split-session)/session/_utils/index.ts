import dayjs from 'dayjs';

export const formatTimeToCode = (attendanceStartTime: string) => {
	return dayjs(attendanceStartTime).format('HHmm');
};
