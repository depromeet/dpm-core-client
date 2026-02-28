import type { CreateAnnouncementRequest } from '@dpm-core/api';
import { announcement } from '@dpm-core/api';
import type { MutationOptions } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

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
