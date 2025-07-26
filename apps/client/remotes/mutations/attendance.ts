import { type ApiResponse, type AttendanceCheckReponse, attendance } from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';

const MUTATE_KEY = 'ATTENDANCE';

interface CheckAttendanceParams {
	attendanceCode: string;
}

type CheckAttendanceOptions = MutationOptions<
	ApiResponse<AttendanceCheckReponse>,
	Error,
	CheckAttendanceParams,
	unknown
>;

/* 출석 체크 */
export const checkAttendanceOptions = (sessionId: number, options?: CheckAttendanceOptions) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, sessionId],
		mutationFn: (params: CheckAttendanceParams) => attendance.check({ sessionId, ...params }),
		...options,
	});
