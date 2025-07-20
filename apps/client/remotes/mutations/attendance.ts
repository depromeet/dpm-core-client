import { attendance } from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';

const MUTATE_KEY = 'ATTENDANCE';

interface CheckAttendanceParams {
	attendanceCode: string;
}

/* 출석 체크 */
export const checkAttendanceOptions = (
	sessionId: number,
	options?: MutationOptions<unknown, Error, CheckAttendanceParams, unknown>,
) =>
	mutationOptions<unknown, Error, { attendanceCode: string }, unknown>({
		mutationKey: [MUTATE_KEY, sessionId],
		mutationFn: (params: CheckAttendanceParams) => attendance.check({ sessionId, ...params }),
		...options,
	});
