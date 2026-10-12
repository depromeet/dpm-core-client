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

interface SessionParams {
	name: string;
	date: string;
	isOnline: boolean;
	place: string;
	week: number;
	attendanceStart: string;
	lateStart: string;
	absentStart: string;
}

interface CreateSessionParams extends SessionParams {
	feedbackEnabled: boolean;
	feedbackStartAt?: string;
	feedbackPushEnabled: boolean;
}

interface ModifySessionParams extends SessionParams {
	sessionId: number;
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
	options?: MutationOptions<unknown, Error, ModifySessionParams>,
) =>
	mutationOptions<unknown, Error, ModifySessionParams>({
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
