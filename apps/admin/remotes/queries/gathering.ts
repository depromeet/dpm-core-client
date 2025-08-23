import { gathering } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

export const getGatheringMembersQueryOptions = (params: { gatheringId: number }) =>
	queryOptions({
		queryKey: ['gatherings', params.gatheringId],
		queryFn: async () => gathering.getGatheringMembers(params),
	});
