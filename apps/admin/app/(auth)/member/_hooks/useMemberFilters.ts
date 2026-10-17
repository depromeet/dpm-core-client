'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
	ManagedMemberPart,
	MemberActivityStatus,
	MemberApprovalStatus,
	MemberBadgeCard,
} from '@dpm-core/api';

import type { MemberManagementFilterParams } from '@/remotes/queries/member';

import { MEMBER_PAGE_SIZE } from '../_constants';

export interface MemberFilterState {
	approvalStatus: MemberApprovalStatus;
	search: string;
	parts: ManagedMemberPart[];
	teamNumbers: number[];
	activityStatuses: MemberActivityStatus[];
	/** 운영진·코어 제외. 승인 완료 탭의 기본값은 켜짐 */
	excludeStaff: boolean;
	missingInformationOnly: boolean;
}

const INITIAL_STATE: MemberFilterState = {
	approvalStatus: 'PENDING',
	search: '',
	parts: [],
	teamNumbers: [],
	activityStatuses: [],
	excludeStaff: true,
	missingInformationOnly: false,
};

/** 탭을 옮기면 이전 탭에서 걸어둔 조건은 모두 지운다. */
function resetForTab(approvalStatus: MemberApprovalStatus): MemberFilterState {
	return { ...INITIAL_STATE, approvalStatus };
}

/**
 * 요약 카드를 누르면 그 카드만 보이도록 탭과 필터를 한 번에 맞춘다.
 * (미승인 → 미승인 탭 / 정보 미입력 → 승인 완료 + 미입력만 / 수료 위험 → 승인 완료 + 수료 위험)
 */
function presetForCard(card: MemberBadgeCard): MemberFilterState {
	switch (card) {
		case 'PENDING':
			return resetForTab('PENDING');
		case 'INCOMPLETE':
			return { ...resetForTab('APPROVED'), missingInformationOnly: true };
		case 'AT_RISK':
			return { ...resetForTab('APPROVED'), activityStatuses: ['AT_RISK'] };
	}
}

/**
 * 탭·검색·필터 상태만 책임지는 훅.
 * 어떤 UI(팝오버·체크박스·요약 카드)가 값을 바꾸는지는 알지 못한다.
 */
export const useMemberFilters = () => {
	const [filters, setFilters] = useState<MemberFilterState>(INITIAL_STATE);

	const setApprovalStatus = useCallback((approvalStatus: MemberApprovalStatus) => {
		setFilters((prev) =>
			prev.approvalStatus === approvalStatus ? prev : resetForTab(approvalStatus),
		);
	}, []);

	const setSearch = useCallback((search: string) => {
		setFilters((prev) => ({ ...prev, search }));
	}, []);

	const setParts = useCallback((parts: ManagedMemberPart[]) => {
		setFilters((prev) => ({ ...prev, parts }));
	}, []);

	const setTeamNumbers = useCallback((teamNumbers: number[]) => {
		setFilters((prev) => ({ ...prev, teamNumbers }));
	}, []);

	const setActivityStatuses = useCallback((activityStatuses: MemberActivityStatus[]) => {
		setFilters((prev) => ({ ...prev, activityStatuses }));
	}, []);

	const setExcludeStaff = useCallback((excludeStaff: boolean) => {
		setFilters((prev) => ({ ...prev, excludeStaff }));
	}, []);

	const applyBadgePreset = useCallback((card: MemberBadgeCard) => {
		setFilters(presetForCard(card));
	}, []);

	/** 승인 완료 탭에서만 쓰는 조건들은 미승인 탭에서 보내지 않는다. */
	const queryParams = useMemo<MemberManagementFilterParams>(() => {
		const isApprovedTab = filters.approvalStatus === 'APPROVED';

		return {
			approvalStatus: filters.approvalStatus,
			search: filters.search.trim() || undefined,
			parts: filters.parts.length > 0 ? filters.parts : undefined,
			teamNumbers:
				isApprovedTab && filters.teamNumbers.length > 0 ? filters.teamNumbers : undefined,
			activityStatuses:
				isApprovedTab && filters.activityStatuses.length > 0 ? filters.activityStatuses : undefined,
			excludeStaff: isApprovedTab ? filters.excludeStaff : false,
			missingInformationOnly: isApprovedTab ? filters.missingInformationOnly : false,
			size: MEMBER_PAGE_SIZE,
		};
	}, [filters]);

	return {
		filters,
		queryParams,
		setApprovalStatus,
		setSearch,
		setParts,
		setTeamNumbers,
		setActivityStatuses,
		setExcludeStaff,
		applyBadgePreset,
	};
};
