'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CohortTeam, ManagedMemberPart, MemberActivityStatus } from '@dpm-core/api';
import { ToggleButton } from '@dpm-core/shared';

import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';

import { ACTIVITY_STATUS_OPTIONS, PART_OPTIONS, UNASSIGNED_TEAM_NUMBER } from '../_constants';
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
	activityStatuses: MemberActivityStatus[];
	excludeStaff: boolean;
	organizerOnly: boolean;
	onPartsChange: (next: ManagedMemberPart[]) => void;
	onTeamNumbersChange: (next: number[]) => void;
	onActivityStatusesChange: (next: MemberActivityStatus[]) => void;
	onExcludeStaffChange: (next: boolean) => void;
	onOrganizerOnlyChange: (next: boolean) => void;
}

/** 승인 완료 탭의 필터 묶음. 각 필터는 자기 값만 알고 서로를 모른다. */
export const MemberFilterBar = ({
	parts,
	teamNumbers,
	activityStatuses,
	excludeStaff,
	organizerOnly,
	onPartsChange,
	onTeamNumbersChange,
	onActivityStatusesChange,
	onExcludeStaffChange,
	onOrganizerOnlyChange,
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
			<ToggleButton
				id="exclude-staff"
				label="운영진/코어 제외"
					className="gap-[5px] border border-line-subtle has-checked:text-label-assistive"
					labelClassName="font-medium text-body2"
				checked={excludeStaff}
				onCheckedChange={(checked) => onExcludeStaffChange(checked === true)}
			/>
			<ToggleButton
				id="organizer-only"
				label="운영진만 보기"
				className="gap-[5px] border border-line-subtle has-checked:text-label-assistive"
				labelClassName="font-medium text-body2"
				checked={organizerOnly}
				onCheckedChange={(checked) => onOrganizerOnlyChange(checked === true)}
			/>
		</div>
	);
};
