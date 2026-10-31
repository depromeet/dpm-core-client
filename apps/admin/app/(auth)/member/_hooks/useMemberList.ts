'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
export const useMemberList = (
	params: MemberManagementFilterParams,
	/** 서버에 운영진 전용 조건이 없어, 켜면 전 페이지를 불러와 운영진 행만 남긴다. */
	organizerOnly = false,
) => {
	const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery(getMemberManagementInfiniteQuery(params));

	const [isLoadingAllForSelection, setIsLoadingAllForSelection] = useState(false);

	const rows = useMemo<MemberRow[]>(() => {
		const all = (data?.pages ?? []).flatMap((page) => page.data.members.map(mapMemberRow));
		return organizerOnly ? all.filter((row) => row.memberType === 'ORGANIZER') : all;
	}, [data, organizerOnly]);

	// 개수와 전체 선택이 맞으려면 운영진 필터 중에는 남은 페이지를 모두 불러와야 한다.
	useEffect(() => {
		if (organizerOnly && hasNextPage && !isFetchingNextPage) fetchNextPage();
	}, [organizerOnly, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// 요약과 갱신 시각은 검색·필터와 무관한 값이라 어느 페이지에 담겨 와도 같다.
	const firstPage = data?.pages[0]?.data;

	const { targetRef } = useInfiniteScroll({
		callback: fetchNextPage,
		canObserve: Boolean(hasNextPage),
		enabled: !isFetchingNextPage,
	});

	/**
	 * "전체 선택" 은 화면에 아직 안 불러온 페이지가 있어도 서버에 있는 전부를 선택해야 한다.
	 * 로드된 행만 기준으로 선택하면, 다음 페이지가 더 있는데도 체크박스는 "전체 선택됨"으로
	 * 보이는 채 실제로는 일부만 선택된 상태가 된다. 그래서 남은 페이지를 먼저 전부 불러온
	 * 뒤, 그 결과로 돌아온 최신 페이지 목록에서 id 를 모아 돌려준다.
	 *
	 * fetchNextPage 가 반환하는 result.data 는 그 시점까지 불러온 모든 페이지를 합친 값이라,
	 * 컴포넌트가 다시 렌더링되길 기다리지 않고도 완전한 목록을 바로 얻을 수 있다.
	 */
	const loadAllAndGetIds = useCallback(async (): Promise<number[]> => {
		if (!hasNextPage) {
			return rows.map((row) => row.id);
		}

		setIsLoadingAllForSelection(true);
		try {
			let result = await fetchNextPage();
			while (result.hasNextPage) {
				result = await fetchNextPage();
			}

			return (result.data?.pages ?? [])
				.flatMap((page) => page.data.members.map(mapMemberRow))
				.filter((row) => !organizerOnly || row.memberType === 'ORGANIZER')
				.map((row) => row.id);
		} finally {
			setIsLoadingAllForSelection(false);
		}
	}, [hasNextPage, fetchNextPage, rows, organizerOnly]);

	return {
		rows,
		summary: firstPage?.summary ?? EMPTY_SUMMARY,
		totalElements: organizerOnly ? rows.length : (firstPage?.totalElements ?? 0),
		lastUpdatedAt: firstPage?.lastUpdatedAt ?? null,
		isLoading,
		isError,
		refetch,
		isFetchingNextPage,
		isLoadingAllForSelection,
		loadAllAndGetIds,
		loadMoreRef: targetRef,
	};
};
