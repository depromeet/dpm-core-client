mport { queryOptions } from '@tanstack/react-query';
import type {
	AfterPartyDetail,
	ApiResponse,
	GetAfterPartiesResponse,
	GetInviteTagsResponse,
} from '@dpm-core/api';
import { afterParty } from '@dpm-core/api';

export const getAfterPartiesQueryOptions = queryOptions<ApiResponse<GetAfterPartiesResponse>>({
	queryKey: ['after-parties'],
	queryFn: afterParty.getAfterParties,
});

export const getAfterPartyByIdQueryOptions = (gatheringId: number) =>
	queryOptions<ApiResponse<AfterPartyDetail>>({
		queryKey: ['after-party', gatheringId],
		queryFn: () => afterParty.getAfterPartyById(gatheringId),
	});

export const getInviteTagsQueryOptions = queryOptions<ApiResponse<GetInviteTagsResponse>>({
	queryKey: ['after-party', 'invite-tags'],
	queryFn: afterParty.getInviteTags,
});

export const getAfterPartyInvitedMembersQueryOptions = (gatheringId: number) =>
	queryOptions({
		queryKey: ['after-party', 'invited-members', gatheringId],
		queryFn: () => afterParty.getInvitedMembers(gatheringId),
	});
