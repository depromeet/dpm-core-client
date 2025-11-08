import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { attendance } from '@dpm-core/api';

export const ATTENDANCE_QUERY_KEY = 'ATTENDANCE';

interface getAttendanceBySessionOptionsParams {
	week: number;
	statuses?: string[];
	teams?: number[];
	onlyMyTeam?: boolean;
	name?: string;
}

export const getAttendanceBySessionOptions = (params: getAttendanceBySessionOptionsParams) =>
	infiniteQueryOptions({
		queryKey: [ATTENDANCE_QUERY_KEY, params],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => {
			return attendance.getAttendanceBySession({ ...params, cursorId: pageParam });
		},
		getNextPageParam: (lastPage) => {
			return lastPage.data.hasNext && lastPage.data.nextCursorId != null
				? lastPage.data.nextCursorId
				: undefined;
		},
		retry: false,
	});

export const getAttendanceByMemberOptions = (
	params: Omit<getAttendanceBySessionOptionsParams, 'week'>,
) =>
	infiniteQueryOptions({
		queryKey: [ATTENDANCE_QUERY_KEY, params],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => {
			return attendance.getAttendanceByMember({ ...params, cursorId: pageParam });
		},
		getNextPageParam: (lastPage) => {
			return lastPage.data.hasNext && lastPage.data.nextCursorId != null
				? lastPage.data.nextCursorId
				: undefined;
		},
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
