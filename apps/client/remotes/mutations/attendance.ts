import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import {
	type ApiErrorReponse,
	type ApiResponse,
	type AttendanceCheckReponse,
	attendance,
} from '@dpm-core/api';


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

/* 결석 사유서 제출 */
export const submitAbsenceReasonOptions = (sessionId: number) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, 'absence-reason', sessionId],
		mutationFn: (params: { contents: string }) =>
			attendance.submitAbsenceReason({ sessionId, ...params }),
	});
