import {
	type ApiErrorReponse,
	type ApiResponse,
	type AttendanceCheckReponse,
	attendance,
} from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

const MUTATE_KEY = 'ATTENDANCE';

interface CheckAttendanceParams {
	attendanceCode: string;
}

type CheckAttendanceOptions = MutationOptions<
	ApiResponse<AttendanceCheckReponse>,
	HTTPError<ApiErrorReponse>,
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
