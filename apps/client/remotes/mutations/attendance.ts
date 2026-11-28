import { mutationOptions } from '@tanstack/react-query';
import { attendance } from '@dpm-core/api';

const MUTATE_KEY = 'ATTENDANCE';

interface CheckAttendanceParams {
	attendanceCode: string;
}

/* 출석 체크 */
export const checkAttendanceOptions = (sessionId: number) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, sessionId],
		mutationFn: (params: CheckAttendanceParams) => attendance.check({ sessionId, ...params }),
	});

/* 결석 사유서 제출 */
export const submitAbsenceReasonOptions = () =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, 'absence-reason'],
		mutationFn: attendance.submitAbsenceReason,
	});
