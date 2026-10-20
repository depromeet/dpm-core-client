import { queryOptions } from '@tanstack/react-query';
import { member } from '@dpm-core/api';

export const getMyMemberInfoQuery = queryOptions({
	queryKey: ['get-my-member-info'],
	queryFn: () => {
		return member.getMyMemberInfo();
	},
	retry: false,
	refetchInterval: false,
});

/** Apple 로그인 숨김 이메일 조회 */
export const getAppleHiddenEmailQuery = queryOptions({
	queryKey: ['apple-hidden-email'],
	queryFn: () => {
		return member.getAppleHiddenEmail();
	},
	retry: false,
	refetchInterval: false,
});

/** 본인 프로필(이름/파트) 최초 입력 필요 여부 조회 */
export const getMyProfileQuery = queryOptions({
	queryKey: ['get-my-profile'],
	queryFn: () => {
		return member.getMyProfile();
	},
	retry: false,
	refetchInterval: false,
});

/** 내 연결 계정(카카오·애플·이메일) 조회 */
export const getMyAccountsQuery = queryOptions({
	queryKey: ['get-my-accounts'],
	queryFn: () => {
		return member.getMyAccounts();
	},
	retry: false,
	refetchInterval: false,
});
