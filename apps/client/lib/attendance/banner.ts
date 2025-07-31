import { ATTENDANCE_GAP_DURATION, ATTENDANCE_LATE_DURATION, ONE_MINUTE } from '@dpm-core/shared';

export const showAttendanceBanner = (date: string) => {
	if (!date) {
		return false;
	}
	const now = new Date();
	const nowTime = now.getTime();
	const startDateTime = new Date(date).getTime();
	const endDateTime =
		startDateTime + ATTENDANCE_GAP_DURATION + ATTENDANCE_LATE_DURATION + ONE_MINUTE;

	return nowTime >= startDateTime && nowTime < endDateTime;
};
