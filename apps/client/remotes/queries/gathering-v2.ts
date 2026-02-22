import { queryOptions } from '@tanstack/react-query';
import { gatheringV2 } from '@dpm-core/api';

export const getGatheringV2ListQueryOptions = queryOptions({
	queryKey: ['gathering-v2', 'list'],
	queryFn: gatheringV2.getList,
});

export const getGatheringV2DetailQueryOptions = (gatheringId: number) =>
	queryOptions({
		queryKey: ['gathering-v2', 'detail', gatheringId],
		queryFn: () => gatheringV2.getDetail(gatheringId),
	});

export const getGatheringV2RsvpMembersQueryOptions = (gatheringId: number) =>
	queryOptions({
		queryKey: ['gathering-v2', 'rsvp-members', gatheringId],
		queryFn: () => gatheringV2.getRsvpMembers(gatheringId),
	});
