import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { CreateAnnouncementRequest, UpdateAnnouncementRequest } from '@dpm-core/api';
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

export type UpdateAnnouncementVariables = {
	announcementId: number;
	body: UpdateAnnouncementRequest;
};

export const updateAnnouncementMutationOptions = (
	options?: MutationOptions<unknown, Error, UpdateAnnouncementVariables>,
) =>
	mutationOptions<unknown, Error, UpdateAnnouncementVariables>({
		...options,
		mutationKey: ['updateAnnouncement'],
		mutationFn: async ({ announcementId, body }) => {
			await announcement.update(announcementId, body);
		},
	});

export const deleteAnnouncementMutationOptions = (
	announcementId: number,
	options?: MutationOptions<unknown, Error, void>,
) =>
	mutationOptions<unknown, Error, void>({
		...options,
		mutationKey: ['deleteAnnouncement', announcementId],
		mutationFn: async () => {
			await announcement.delete(announcementId);
		},
	});

export type PatchAssignmentStatusVariables = {
	submitStatus: string;
	assignmentScore?: number;
	memberIds: number[];
};

export const remindNotificationMutationOptions = (
	announcementId: number,
	options?: MutationOptions<unknown, Error, void>,
) =>
	mutationOptions<unknown, Error, void>({
		...options,
		mutationKey: ['remindNotification', announcementId],
		mutationFn: async () => {
			await announcement.remindNotification(announcementId);
		},
	});

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
