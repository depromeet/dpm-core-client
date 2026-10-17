'use client';

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { MemberManagementTotals } from '@dpm-core/api';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
	getMemberManagementInfiniteQuery,
	type MemberManagementFilterParams,
} from '@/remotes/queries/member';

import { mapMemberRow } from '../_lib/map-member-row';
import type { MemberRow } from '../_types';

const EMPTY_SUMMARY: MemberManagementTotals = {
	totalMemberCount: 0,
	deeperCount: 0,
	organizerCount: 0,
	coreCount: 0,
	pendingCount: 0,
	missingInformationCount: 0,
	graduationRiskCount: 0,
};

/**
 * 조회 조건을 받아 테이블이 그릴 행과 요약을 돌려준다.
 * 페이지를 어떻게 이어 붙이는지는 여기서만 알고, 화면은 평평한 목록만 본다.
 */
export const useMemberList = (params: MemberManagementFilterParams) => {
	const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery(getMemberManagementInfiniteQuery(params));

	const rows = useMemo<MemberRow[]>(
		() => (data?.pages ?? []).flatMap((page) => page.data.members.map(mapMemberRow)),
		[data],
	);

	// 요약과 갱신 시각은 검색·필터와 무관한 값이라 어느 페이지에 담겨 와도 같다.
	const firstPage = data?.pages[0]?.data;

	const { targetRef } = useInfiniteScroll({
		callback: fetchNextPage,
		canObserve: Boolean(hasNextPage),
		enabled: !isFetchingNextPage,
	});

	return {
		rows,
		summary: firstPage?.summary ?? EMPTY_SUMMARY,
		totalElements: firstPage?.totalElements ?? 0,
		lastUpdatedAt: firstPage?.lastUpdatedAt ?? null,
		isLoading,
		isError,
		refetch,
		isFetchingNextPage,
		loadMoreRef: targetRef,
	};
};
