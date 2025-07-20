import { session } from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';

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
