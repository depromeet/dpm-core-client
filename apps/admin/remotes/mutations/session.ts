import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import { session } from '@dpm-core/api';

type EditSessionAttendanceTimeArgs = {
	sessionId: string;
	attendanceStartTime: string;
};

export const editSessionAttendanceTimeMutationOptions = (
	options?: MutationOptions<boolean, Error, EditSessionAttendanceTimeArgs>,
) =>
	mutationOptions<boolean, Error, EditSessionAttendanceTimeArgs>({
		...options,
		mutationKey: ['editSessionAttendanceTime'],
		mutationFn: async ({ sessionId, attendanceStartTime }) => {
			await session.editSessionAttendanceTime(sessionId, attendanceStartTime);
			return true;
		},
	});

// TODO: 서버에서 데이터 타입 수정 후 타입 공통화
interface CreateSessionParams {
	name: string;
	date: string;
	isOnline: boolean;
	place: string;
	week: number;
	attendanceStart: string;
	lateStart: string;
	absentStart: string;
}

export const createSessionMutationOptions = (
	options?: MutationOptions<unknown, Error, CreateSessionParams>,
) =>
	mutationOptions<unknown, Error, CreateSessionParams>({
		...options,
		mutationKey: ['createSession'],
		mutationFn: async (params) => {
			return await session.createSession(params);
		},
	});

export const modifySessionMutationOptions = (
	options?: MutationOptions<unknown, Error, CreateSessionParams & { sessionId: number }>,
) =>
	mutationOptions<unknown, Error, CreateSessionParams & { sessionId: number }>({
		...options,
		mutationKey: ['modifySession'],
		mutationFn: async (params) => {
			return await session.modifySession(params);
		},
	});

export const deleteSessionMutationOptions = (
	options?: MutationOptions<unknown, Error, { sessionId: number }>,
) =>
	mutationOptions<unknown, Error, { sessionId: number }>({
		...options,
		mutationKey: ['deleteSession'],
		mutationFn: async (params) => {
			return await session.deleteSession(params);
		},
	});
