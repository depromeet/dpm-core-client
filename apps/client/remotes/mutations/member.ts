import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { type ApiErrorReponse, member } from '@dpm-core/api';

type WithdrawMutationOptions = MutationOptions;

export const withdrawMutationOptions = (options: WithdrawMutationOptions) =>
	mutationOptions({
		mutationKey: ['withdraw'],
		mutationFn: async () => {
			await member.withdraw();
			return true;
		},
		...options,
	});

interface ApproveWhitelistParams {
	signupEmail: string;
	name: string;
}

type ApproveWhitelistOptions = MutationOptions<
	unknown,
	HTTPError<ApiErrorReponse>,
	ApproveWhitelistParams,
	unknown
>;

export const approveWhitelistMutationOptions = (options: ApproveWhitelistOptions) =>
	mutationOptions({
		mutationKey: ['whitelist'],
		mutationFn: (params: ApproveWhitelistParams) => member.approveWhitelist(params),
		...options,
	});
