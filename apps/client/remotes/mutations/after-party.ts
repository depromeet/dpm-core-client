import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type {
	ApiErrorReponse,
	ApiResponse,
	CreateAfterPartyRequest,
	CreateAfterPartyResponse,
	UpdateAfterPartyRequest,
} from '@dpm-core/api';
import { afterParty } from '@dpm-core/api';

type CreateAfterPartyOptions = MutationOptions<
	ApiResponse<CreateAfterPartyResponse>,
	HTTPError<ApiErrorReponse>,
	CreateAfterPartyRequest,
	unknown
>;

export const createAfterPartyOptions = (options: CreateAfterPartyOptions) =>
	mutationOptions({
		mutationKey: ['create-after-party'],
		mutationFn: (params: CreateAfterPartyRequest) => afterParty.createAfterParty(params),
		...options,
	});

type UpdateAfterPartyOptions = MutationOptions<
	ApiResponse<CreateAfterPartyResponse>,
	HTTPError<ApiErrorReponse>,
	{ gatheringId: number; params: UpdateAfterPartyRequest },
	unknown
>;

export const updateAfterPartyOptions = (options: UpdateAfterPartyOptions) =>
	mutationOptions({
		mutationKey: ['update-after-party'],
		mutationFn: ({ gatheringId, params }) => afterParty.updateAfterParty(gatheringId, params),
		...options,
	});
