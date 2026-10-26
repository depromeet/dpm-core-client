import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { ManagedMemberPart, MemberManagementRequest } from '@dpm-core/api';
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

/** GET /v1/roles/members?memberIds=... - 멤버 기수별 역할 목록 조회 */
export const getMembersRolesQuery = (memberIds: number[]) =>
	queryOptions({
		queryKey: ['members-roles', [...memberIds].sort((a, b) => a - b)] as const,
		queryFn: () => member.getMembersRoles(memberIds),
		enabled: memberIds.length > 0,
	});

/* -------------------------------------------------------------------------- *
 * 멤버 관리 (v3)
 * -------------------------------------------------------------------------- */

export const MEMBER_MANAGEMENT_QUERY_KEY = ['member-management'] as const;
export const MEMBER_BADGES_QUERY_KEY = ['member-badges'] as const;

/** 페이지마다 달라지는 page 를 뺀 나머지 조회 조건. 쿼리 키로도 쓴다. */
export type MemberManagementFilterParams = Omit<MemberManagementRequest, 'page'>;

/**
 * GET /v3/members/overview - 멤버 관리 목록 (무한 스크롤)
 * 요약과 lastUpdatedAt 은 매 페이지에 함께 오므로 첫 페이지 값을 쓴다.
 */
export const getMemberManagementInfiniteQuery = (params: MemberManagementFilterParams) =>
	infiniteQueryOptions({
		queryKey: [...MEMBER_MANAGEMENT_QUERY_KEY, params] as const,
		queryFn: ({ pageParam }) => member.getMemberManagement({ ...params, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			const { page, size, totalElements } = lastPage.data;
			return page * size < totalElements ? page + 1 : undefined;
		},
		placeholderData: keepPreviousData,
	});

/** GET /v3/members/badges - 요약 카드 NEW 표시 */
export const getMemberBadgesQuery = queryOptions({
	queryKey: MEMBER_BADGES_QUERY_KEY,
	queryFn: () => member.getMemberBadges(),
	select: (data) => data.data,
});

/** GET /v3/members/parts - 파트 선택지 */
export const getMemberPartsQuery = queryOptions({
	queryKey: ['member-parts'],
	queryFn: () => member.getMemberParts(),
	select: (data) => data.data.parts,
	staleTime: 5 * 60 * 1000,
});

/**
 * 미승인 계정과 같은 이름·직군의 승인된 계정 후보 조회.
 * 검색은 닉네임·이메일 부분 일치라서, 정확히 같은 사람인지는 호출하는 쪽에서 한 번 더 걸러낸다.
 */
export const getApprovedMergeCandidatesQuery = (name: string, part: ManagedMemberPart) =>
	queryOptions({
		queryKey: [...MEMBER_MANAGEMENT_QUERY_KEY, 'merge-candidates', name, part] as const,
		queryFn: () =>
			member.getMemberManagement({
				approvalStatus: 'APPROVED',
				search: name,
				parts: [part],
				// 병합 상대가 운영진·코어 계정일 수도 있어 함께 조회한다.
				excludeStaff: false,
				missingInformationOnly: false,
				page: 1,
				size: 30,
			}),
		// 병합 직전 판단에 쓰므로 캐시를 믿지 않고 항상 새로 받는다.
		staleTime: 0,
	});
