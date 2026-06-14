import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { type ApiErrorReponse, type AppleMemberProfileUpdateRequest, member } from '@dpm-core/api';

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
		mutationFn: (params: ApproveWhitelistParams) => member.approveWhitelistForSignup(params),
		...options,
	});

type UpdateAppleProfileOptions = MutationOptions<
	unknown,
	HTTPError<ApiErrorReponse>,
	AppleMemberProfileUpdateRequest,
	unknown
>;

/** Apple 로그인 멤버 프로필(이름/직군) 수정 */
export const updateAppleProfileMutationOptions = (options?: UpdateAppleProfileOptions) =>
	mutationOptions({
		mutationKey: ['apple-profile-update'],
		mutationFn: (params: AppleMemberProfileUpdateRequest) => member.updateAppleProfile(params),
		...options,
	});
