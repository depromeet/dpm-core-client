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

/** 멤버 이름이 식별 불가능한 해시(id) 형식인지 검증 */
export const getNameHashTypeValidationQuery = (name: string) =>
	queryOptions({
		queryKey: ['name-hash-type-validation', name],
		queryFn: () => {
			return member.validateNameHashType({ name });
		},
		enabled: name.length > 0,
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
		refetchInterval: false,
	});
