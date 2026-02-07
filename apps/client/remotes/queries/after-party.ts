import { queryOptions } from '@tanstack/react-query';
import type { ApiResponse, GetAfterPartiesResponse } from '@dpm-core/api';
import { afterParty } from '@dpm-core/api';

export const getAfterPartiesQueryOptions = queryOptions<ApiResponse<GetAfterPartiesResponse>>({
	queryKey: ['after-parties'],
	queryFn: afterParty.getAfterParties,
});
