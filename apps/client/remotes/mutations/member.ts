import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import {
	type ApiErrorReponse,
	type LinkableLoginMethod,
	type MemberProfileUpdateRequest,
	member,
	notification,
} from '@dpm-core/api';

type WithdrawMutationOptions = MutationOptions;

export const withdrawMutationOptions = (options: WithdrawMutationOptions) =>
	mutationOptions({
		mutationKey: ['withdraw'],
		mutationFn: async () => {
			// 탈퇴하면 인증이 사라져 토큰을 지울 수 없으므로 먼저 지운다.
			// 서버는 토큰이 없을 때도 오류를 내므로, 실패해도 탈퇴는 그대로 진행한다.
			await notification.deleteAllPushTokens().catch(() => undefined);
			await member.withdraw();
			return true;
		},
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

type ReapplyMembershipOptions = MutationOptions<unknown, HTTPError<ApiErrorReponse>, void, unknown>;

/** 반려 회원 본인 재신청 (PENDING으로 전환) */
export const reapplyMembershipMutationOptions = (options?: ReapplyMembershipOptions) =>
	mutationOptions({
		mutationKey: ['member-reapply'],
		mutationFn: () => member.reapplyMembership(),
		...options,
	});

/* --------------------------------------------------------------------- *
 * 계정 연동 (본인)
 * --------------------------------------------------------------------- */

interface StartAccountLinkParams {
	provider: LinkableLoginMethod;
	redirectUri: string;
}

type StartAccountLinkOptions = MutationOptions<
	Awaited<ReturnType<typeof member.startAccountLink>>,
	HTTPError<ApiErrorReponse>,
	StartAccountLinkParams,
	unknown
>;

/** 소셜 계정 연결 시작. 성공하면 authorizationUrl 로 직접 이동해야 한다. */
export const startAccountLinkMutationOptions = (options?: StartAccountLinkOptions) =>
	mutationOptions({
		mutationKey: ['account-link-start'],
		mutationFn: ({ provider, redirectUri }: StartAccountLinkParams) =>
			member.startAccountLink(provider, { redirectUri }),
		...options,
	});

interface CompleteAccountLinkParams {
	provider: LinkableLoginMethod;
	authorizationCode: string;
	state: string;
}

type CompleteAccountLinkOptions = MutationOptions<
	Awaited<ReturnType<typeof member.completeAccountLink>>,
	HTTPError<ApiErrorReponse>,
	CompleteAccountLinkParams,
	unknown
>;

/** 제공자 콜백에서 받은 code/state 로 소셜 계정 연결을 완료한다. */
export const completeAccountLinkMutationOptions = (options?: CompleteAccountLinkOptions) =>
	mutationOptions({
		mutationKey: ['account-link-complete'],
		mutationFn: ({ provider, authorizationCode, state }: CompleteAccountLinkParams) =>
			member.completeAccountLink(provider, { authorizationCode, state }),
		...options,
	});

type UnlinkAccountOptions = MutationOptions<
	Awaited<ReturnType<typeof member.unlinkAccount>>,
	HTTPError<ApiErrorReponse>,
	number,
	unknown
>;

/** 소셜 계정 연결 해제. accountId 는 memberId 가 아니라 연결 식별자다. */
export const unlinkAccountMutationOptions = (options?: UnlinkAccountOptions) =>
	mutationOptions({
		mutationKey: ['account-unlink'],
		mutationFn: (accountId: number) => member.unlinkAccount(accountId),
		...options,
	});
