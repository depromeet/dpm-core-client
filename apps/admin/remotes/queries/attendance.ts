import { queryOptions } from '@tanstack/react-query';
import { attendance } from '@dpm-core/api';

export const ATTENDANCE_QUERY_KEY = 'ATTENDANCE';

export const getAttendanceBySessionOptions = (params: { sessionId: number }) =>
	queryOptions({
		queryKey: [ATTENDANCE_QUERY_KEY, 'session', params.sessionId],
		queryFn: () => attendance.getAttendanceBySession(params),
		staleTime: 0,
		retry: false,
	});

export const getAttendanceByMemberOptions = () =>
	queryOptions({
		queryKey: [ATTENDANCE_QUERY_KEY, 'people'],
		queryFn: attendance.getAttendanceByMember,
		staleTime: 0,
		retry: false,
	});

export const getAttendanceByMemberDetailOptions = ({ memberId }: { memberId: number }) =>
	queryOptions({
		queryKey: [ATTENDANCE_QUERY_KEY, memberId],
		queryFn: () => attendance.getAttendanceByMemberDetail({ memberId }),
		retry: false,
	});

export const getAttendanceBySessionDetailOptions = ({
	memberId,
	sessionId,
}: {
	memberId: number;
	sessionId: number;
}) =>
	queryOptions({
		queryKey: [ATTENDANCE_QUERY_KEY, memberId, sessionId],
		queryFn: () => attendance.getAttendanceBySessionDetail({ memberId, sessionId }),
		retry: false,
	});

export const getAbsenceReasonsOptions = ({ sessionId }: { sessionId: number }) =>
	queryOptions({
		queryKey: [ATTENDANCE_QUERY_KEY, 'absence-reasons', sessionId],
		queryFn: () => attendance.getAbsenceReasons({ sessionId }),
		retry: false,
	});
