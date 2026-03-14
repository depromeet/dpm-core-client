import { queryOptions } from '@tanstack/react-query';
import { member } from '@dpm-core/api';

const MEMBERS_OVERVIEW_QUERY_KEY = ['members-overview'] as const;

export interface GetMembersOverviewParams {
	latest?: boolean;
}

/** 1. 배너 승인요청 개수 - members overview에서 PENDING 개수 사용 */
export const getPendingMemberCountQuery = queryOptions({
	queryKey: MEMBERS_OVERVIEW_QUERY_KEY,
	queryFn: () => member.getMembersOverview({ latest: true }),
	select: (data) => data.data.members.filter((m) => m.status === 'PENDING').length,
});

/** 2. 멤버관리 페이지 테이블 리스트 - /v1/members/overview */
export const getMembersOverviewQuery = (params?: GetMembersOverviewParams) =>
	queryOptions({
		queryKey: [...MEMBERS_OVERVIEW_QUERY_KEY, params?.latest] as const,
		queryFn: () => member.getMembersOverview(params),
	});

export const getMyMemberInfoQuery = queryOptions({
	queryKey: ['get-my-member-info'],
	queryFn: () => {
		return member.getMyMemberInfo();
	},
	retry: false,
	refetchInterval: false,
});
