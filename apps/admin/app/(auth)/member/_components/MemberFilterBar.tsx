'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CohortTeam, ManagedMemberPart, ManagedMemberType, MemberActivityStatus } from '@dpm-core/api';
import { ToggleButton } from '@dpm-core/shared';

import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';

import { MEMBER_TYPE_OPTIONS, ACTIVITY_STATUS_OPTIONS, PART_OPTIONS, UNASSIGNED_TEAM_NUMBER } from '../_constants';
import { toRealTeamNumbers } from '../_lib/team-options';
import { MultiSelectFilter } from './MultiSelectFilter';

function toTeamOptions(teams: CohortTeam[]) {
	return [
		{ value: String(UNASSIGNED_TEAM_NUMBER), label: '미배정' },
		...toRealTeamNumbers(teams).map((number) => ({ value: String(number), label: `${number}팀` })),
	];
}

interface MemberFilterBarProps {
	parts: ManagedMemberPart[];
	teamNumbers: number[];
	memberTypes: ManagedMemberType[];
	activityStatuses: MemberActivityStatus[];
	onPartsChange: (next: ManagedMemberPart[]) => void;
	onTeamNumbersChange: (next: number[]) => void;
	onMemberTypesChange: (next: ManagedMemberType[]) => void;
	onActivityStatusesChange: (next: MemberActivityStatus[]) => void;
}

/** 승인 완료 탭의 필터 묶음. 각 필터는 자기 값만 알고 서로를 모른다. */
export const MemberFilterBar = ({
	parts,
	teamNumbers,
	memberTypes,
	activityStatuses,
	onPartsChange,
	onTeamNumbersChange,
	onMemberTypesChange,
	onActivityStatusesChange,
}: MemberFilterBarProps) => {
	const { data: teams } = useQuery(getCurrentCohortTeamsQuery);
	const teamOptions = useMemo(() => toTeamOptions(teams ?? []), [teams]);

	return (
		<div className="flex items-center gap-2">
			<MultiSelectFilter
				title="팀별"
				options={teamOptions}
				value={teamNumbers.map(String)}
				onChange={(next) => onTeamNumbersChange(next.map(Number))}
			/>
			<MultiSelectFilter
				title="파트별"
				options={PART_OPTIONS}
				value={parts}
				onChange={onPartsChange}
			/>
			<MultiSelectFilter
				title="활동 상태별"
				options={ACTIVITY_STATUS_OPTIONS}
				value={activityStatuses}
				onChange={onActivityStatusesChange}
			/>
			<MultiSelectFilter
				title="멤버 타입별"
				options={MEMBER_TYPE_OPTIONS}
				value={memberTypes}
				onChange={onMemberTypesChange}
			/>
		</div>
	);
};
