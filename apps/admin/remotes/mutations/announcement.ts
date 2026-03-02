import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { CreateAnnouncementRequest } from '@dpm-core/api';
import { announcement } from '@dpm-core/api';

export const createAnnouncementMutationOptions = (
	options?: MutationOptions<unknown, Error, CreateAnnouncementRequest>,
) =>
	mutationOptions<unknown, Error, CreateAnnouncementRequest>({
		...options,
		mutationKey: ['createAnnouncement'],
		mutationFn: async (body) => {
			await announcement.create(body);
		},
	});

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
