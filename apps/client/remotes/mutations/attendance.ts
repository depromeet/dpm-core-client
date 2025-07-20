import { attendance } from '@dpm-core/api';
import { type MutationOptions, useMutation } from '@tanstack/react-query';

type CheckAttendanceParams = {
	sessionId: number;
	attedanceCode: string;
};

type CheckMutationOptions = MutationOptions<boolean, Error, CheckAttendanceParams>;

export const useCheckAttendance = (options?: CheckMutationOptions) => {
	return useMutation<boolean, Error, CheckAttendanceParams>({
		...options,
		mutationFn: async (params) => {
			await attendance.check({
				sessionId: params.sessionId,
				attendanceCode: params.attedanceCode,
			});
			return true;
		},
	});
};
