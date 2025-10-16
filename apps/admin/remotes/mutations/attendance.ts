import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import { type AttendanceStatus, attendance } from '@dpm-core/api';

const MUTATE_KEY = 'ATTENDANCE';

interface ModifyAttendanceStatusParams {
	attendanceStatus: AttendanceStatus;
}

type ModifyAttendanceStatusOptions = MutationOptions<
	unknown,
	Error,
	ModifyAttendanceStatusParams,
	unknown
>;

/* 출석 상태 변경 */
export const modifyAttendanceStatusOptions = (
	sessionId: number,
	memberId: number,
	options?: ModifyAttendanceStatusOptions,
) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, sessionId],
		mutationFn: (params: ModifyAttendanceStatusParams) =>
			attendance.modifyAttendanceStatus({ sessionId, memberId, ...params }),
		...options,
	});
