import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { type ApiErrorReponse, type MemberProfileUpdateRequest, member } from '@dpm-core/api';

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

type UpdateMyProfileOptions = MutationOptions<
	unknown,
	HTTPError<ApiErrorReponse>,
	MemberProfileUpdateRequest,
	unknown
>;

/** 본인 프로필(이름/직군) 최초 입력 */
export const updateMyProfileMutationOptions = (options?: UpdateMyProfileOptions) =>
	mutationOptions({
		mutationKey: ['my-profile-update'],
		mutationFn: (params: MemberProfileUpdateRequest) => member.updateMyProfile(params),
		...options,
	});
