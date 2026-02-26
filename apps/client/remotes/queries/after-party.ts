import { queryOptions } from '@tanstack/react-query';
import type { ApiResponse, GetAfterPartiesResponse } from '@dpm-core/api';
import { afterParty } from '@dpm-core/api';

export const getAfterPartiesQueryOptions = queryOptions<ApiResponse<GetAfterPartiesResponse>>({
	queryKey: ['after-parties'],
	queryFn: afterParty.getAfterParties,
});

export const getAfterPartyDetailQueryOptions = (gatheringId: number) =>
	queryOptions({
		queryKey: ['after-party', 'detail', gatheringId],
		queryFn: () => afterParty.getDetail(gatheringId),
	});

export const getAfterPartyInvitedMembersQueryOptions = (gatheringId: number) =>
	queryOptions({
		queryKey: ['after-party', 'invited-members', gatheringId],
		queryFn: () => afterParty.getInvitedMembers(gatheringId),
	});
