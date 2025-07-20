import { attendance } from '@dpm-core/api';
import { type MutationOptions, useMutation } from '@tanstack/react-query';

// 출석 체크

export const useCheckAttendance = (sessionId: number, options?: MutationOptions) => {
	return useMutation({
		...options,
		mutationFn: (params: { attedanceCode: string }) => attendance.check({ sessionId, params }),
	});
};
