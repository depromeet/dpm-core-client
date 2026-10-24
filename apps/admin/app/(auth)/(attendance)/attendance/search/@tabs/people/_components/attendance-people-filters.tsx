'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { AttendanceMember, CohortTeam, MemberAttendanceStatus } from '@dpm-core/api';
import {
	Checkbox,
	ChevronDown,
	cn,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@dpm-core/shared';

import { AttendanceFilterPopover, RotateCwIcon } from '@/components/attendance';

interface AttendancePeopleFiltersProps {
	members: AttendanceMember[];
	statusMembers: AttendanceMember[];
	myTeamNumber: number | null;
	teams: CohortTeam[];
	filters: Record<string, string>;
	onChange: (values: Record<string, string>) => void;
}
const STATUS_TABS: { value: MemberAttendanceStatus | ''; label: string }[] = [
	{ value: '', label: '전체' },
	{ value: 'NORMAL', label: '수료 가능' },
	{ value: 'AT_RISK', label: '수료 위험' },
	{ value: 'IMPOSSIBLE', label: '수료 불가' },
];

export function AttendancePeopleFilters({
	members,
	statusMembers,
	myTeamNumber,
	teams,
	filters,
	onChange,
}: AttendancePeopleFiltersProps) {
	const [open, setOpen] = useState(false);
	const [draftTeams, setDraftTeams] = useState<string[]>([]);

	const selectedTeams = filters.teams?.split(',').filter(Boolean) ?? [];
	const hasFilters = Boolean(filters.name || filters.status || filters.myTeam || filters.teams);
	const availableMembers = members.filter(
		(member) =>
			(!filters.name || member.name.includes(filters.name.trim())) &&
			(!filters.status || member.attendanceStatus === filters.status) &&
			(filters.myTeam !== 'true' || (myTeamNumber !== null && member.teamNumber === myTeamNumber)),
	);
	const teamOptions = [
		...teams
			.filter((team) => team.number !== 0)
			.map((team) => ({ value: String(team.number), label: `${team.number}팀` })),
		{ value: '0', label: '미배정' },
	].map((team) => ({
		...team,
		disabled:
			!draftTeams.includes(team.value) &&
			!availableMembers.some((member) => String(member.teamNumber) === team.value),
	}));

	const firstTeamLabel = selectedTeams[0] === '0' ? '미배정' : `${selectedTeams[0]}팀`;
	const teamLabel = selectedTeams.length
		? `${firstTeamLabel}${selectedTeams.length > 1 ? ` 외 ${selectedTeams.length - 1}` : ''}`
		: '팀별';

	return (
		<div className="flex shrink-0 items-center justify-between gap-4 px-10 pt-6 pb-3">
			<div className="flex items-center gap-2">
				<div className="relative flex h-10 w-90 overflow-hidden rounded-md after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-line-normal after:ring-inset">
					{STATUS_TABS.map(({ value, label }) => {
						const availableCount = value
							? statusMembers.filter((member) => member.attendanceStatus === value).length
							: statusMembers.length;
						return (
							<button
								type="button"
								key={value}
								disabled={availableCount === 0}
								onClick={() => onChange({ status: value })}
								className={cn(
									'h-full min-w-0 flex-1 whitespace-nowrap border-line-normal border-r font-medium text-body2 first:rounded-l-md last:rounded-r-md last:border-0 disabled:cursor-not-allowed disabled:opacity-40',
									(filters.status ?? '') === value
										? 'bg-primary-extralight text-primary-normal'
										: 'text-label-assistive',
								)}
							>
								{label} {availableCount}
							</button>
						);
					})}
				</div>
				<div className="flex h-10 w-50 items-center gap-2 rounded-lg border border-line-normal px-4">
					<input
						placeholder="디퍼 검색"
						value={filters.name ?? ''}
						onChange={(event) => onChange({ name: event.target.value })}
						className="min-w-0 flex-1 bg-transparent text-body2 outline-none placeholder:text-label-assistive"
					/>
					{filters.name ? (
						<button
							type="button"
							title="검색 초기화"
							onClick={() => onChange({ name: '' })}
							className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-strong text-label-assistive"
						>
							<X className="size-3.5" />
						</button>
					) : (
						<Search className="size-5 shrink-0 text-label-assistive" />
					)}
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				{hasFilters && (
					<button
						type="button"
						title="필터 초기화"
						onClick={() => onChange({ name: '', status: '', teams: '', myTeam: '', parts: '' })}
						className="flex size-8 cursor-pointer items-center justify-center text-label-assistive"
					>
						<RotateCwIcon />
					</button>
				)}
				<label
					htmlFor="people-my-team"
					className={cn(
						'flex h-10 w-30.25 cursor-pointer items-center gap-1.25 whitespace-nowrap rounded-lg border border-line-subtle px-3.75 font-medium text-body2 text-label-assistive',
						myTeamNumber === null && 'cursor-not-allowed opacity-40',
					)}
				>
					<Checkbox
						id="people-my-team"
						className="size-4 rounded-sm border-line-normal shadow-none data-[state=checked]:bg-primary-normal"
						checked={filters.myTeam === 'true'}
						disabled={myTeamNumber === null}
						onCheckedChange={(checked) => onChange({ myTeam: checked === true ? 'true' : '' })}
					/>
					내 팀만 보기
				</label>
				<Popover
					open={open}
					onOpenChange={(value) => {
						setOpen(value);
						if (value) setDraftTeams(selectedTeams);
					}}
				>
					<PopoverTrigger asChild>
						<button
							type="button"
							className={cn(
								'flex h-10 items-center gap-1 rounded-lg border border-line-normal px-3.75 font-medium text-body2 text-label-assistive',
								selectedTeams.length > 0 && 'border-primary-normal text-primary-normal',
							)}
						>
							{teamLabel}
							<ChevronDown className="size-3" />
						</button>
					</PopoverTrigger>
					<PopoverContent align="end" sideOffset={12} className="w-auto border-0 p-0 shadow-none">
						<AttendanceFilterPopover
							sections={[{ label: '팀별', options: teamOptions }]}
							selectedValues={{ 팀별: draftTeams }}
							onClose={() => setOpen(false)}
							onReset={() => setDraftTeams([])}
							onFilterChange={(_, value) =>
								setDraftTeams((values) =>
									values.includes(value)
										? values.filter((item) => item !== value)
										: [...values, value],
								)
							}
							onApply={() => {
								onChange({ teams: draftTeams.join(','), parts: '' });
								setOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
