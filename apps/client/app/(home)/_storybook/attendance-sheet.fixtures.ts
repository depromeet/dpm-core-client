import { HTTPError } from 'ky';
import type { ApiErrorReponse } from '@dpm-core/api';

import { getAttendanceMeBySessionIdOptions } from '@/remotes/queries/attendance';
import { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

import type { AttendanceCheckBottomSheetOptions } from '../_components/attendance-check-bottom-sheet';
import { homeSessionFeedback, homeResponse, homeSessionItem, makeAttendance } from './home-cases';

export const ATTENDANCE_CODE = '3824';

export const ATTENDANCE_SUBMISSION_ERRORS = {
	tooEarly: { code: 'SESSION-400-03', message: '출석하기에는 너무 이른 시간입니다' },
	alreadyRegistered: { code: 'SESSION-400-04', message: '이미 출석을 체크했습니다' },
	closed: { code: 'SESSION-400-06', message: '출석 인증 시간이 마감되었습니다' },
	manuallyUpdated: { code: 'SESSION-400-07', message: '운영진이 이미 출석 상태를 확정했습니다' },
	organizer: { code: 'ATTENDANCE-403-01', message: '운영진은 출석 인증을 할 수 없습니다' },
} as const;

type AttendanceSubmissionError = keyof typeof ATTENDANCE_SUBMISSION_ERRORS;
type AttendanceSubmissionStatus = 'PRESENT' | 'LATE' | 'ABSENT';

export type AttendanceSubmissionCase =
	| AttendanceSubmissionStatus
	| AttendanceSubmissionError
	| 'pending'
	| 'server'
	| 'network';

const submissionPending = new Promise<never>(() => undefined);

function makeAttendanceError(status: number, error?: Pick<ApiErrorReponse, 'code' | 'message'>) {
	const method = 'POST';
	const path = `/v1/sessions/${homeSessionItem.id}/attendances`;
	const request = new Request(new URL(path, 'http://localhost:3000'), { method });
	const response = error
		? Response.json({ status: status === 403 ? 'FORBIDDEN' : 'BAD_REQUEST', ...error }, { status })
		: new Response(null, { status });

	return new HTTPError(response, request, {
		method,
		prefixUrl: '',
		retry: { limit: 0 },
		context: {},
		onDownloadProgress: undefined,
		onUploadProgress: undefined,
	});
}

export function makeAttendanceSubmission(
	result: AttendanceSubmissionCase,
	attendedAt: string,
): AttendanceCheckBottomSheetOptions {
	const sessionId = homeSessionItem.id;

	return {
		submit: async ({ attendanceCode }) => {
			if (attendanceCode !== ATTENDANCE_CODE) {
				throw makeAttendanceError(400, {
					code: 'SESSION-400-02',
					message: '출석코드가 일치하지 않습니다',
				});
			}
			if (result === 'pending') return submissionPending;
			if (result === 'server') throw makeAttendanceError(500);
			if (result === 'network') throw new TypeError('출석 인증 요청에 연결하지 못했어요.');
			if (result === 'PRESENT' || result === 'LATE' || result === 'ABSENT') {
				return {
					status: 'OK',
					message: '요청에 성공했습니다',
					code: 'GLOBAL-200-01',
					data: { attendanceStatus: result, attendedAt },
				};
			}

			throw makeAttendanceError(
				result === 'organizer' ? 403 : 400,
				ATTENDANCE_SUBMISSION_ERRORS[result],
			);
		},
		onSuccess: ({ data }, queryClient) => {
			queryClient.setQueryData(
				getAttendanceMeBySessionIdOptions({ sessionId }).queryKey,
				homeResponse(makeAttendance(data.attendanceStatus, { attendedAt: data.attendedAt })),
			);

			if (data.attendanceStatus === 'ABSENT') {
				queryClient.setQueryData(
					getMyPendingSessionFeedbackQuery().queryKey,
					homeResponse(homeSessionFeedback),
				);
			}
		},
	};
}
