import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import { announcement } from '@dpm-core/api';

export type PatchAssignmentStatusVariables = {
	submitStatus: string;
	memberIds: number[];
};

export const patchAssignmentStatusMutationOptions = (
	announcementId: number,
	options?: MutationOptions<unknown, Error, PatchAssignmentStatusVariables>,
) =>
	mutationOptions<unknown, Error, PatchAssignmentStatusVariables>({
		...options,
		mutationKey: ['patchAssignmentStatus', announcementId],
		mutationFn: async (variables) => {
			return await announcement.patchAssignmentStatus(announcementId, variables);
		},
	});
