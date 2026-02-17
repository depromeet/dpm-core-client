import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type {
	ApiErrorReponse,
	ApiResponse,
	CreateAfterPartyRequest,
	CreateAfterPartyResponse,
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
