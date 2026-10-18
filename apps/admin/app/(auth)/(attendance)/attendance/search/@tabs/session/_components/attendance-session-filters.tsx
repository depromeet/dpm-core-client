'use client';

import { useState } from 'react';
import { RotateCcw, Search, X } from 'lucide-react';
import type {
	AttendanceBySessionMember,
	AttendanceStatus,
	CohortTeam,
	ManagedMemberPart,
} from '@dpm-core/api';
import {
	Button,
	ChevronDown,
	cn,
	Popover,
	PopoverContent,
	PopoverTrigger,
	TableCheckbox,
} from '@dpm-core/shared';

import { AttendanceFilterPopover } from '@/components/attendance';
import { getMemberPartLabel } from '@/lib/member/part';

interface AttendanceSessionFiltersProps {
	members: AttendanceBySessionMember[];
	statusMembers: AttendanceBySessionMember[];
	teams: CohortTeam[];
	parts: ManagedMemberPart[];
	myTeamNumber: number | null;
	filters: Record<string, string>;
	onChange: (values: Record<string, string>) => void;
}
const PART_ORDER: ManagedMemberPart[] = ['WEB', 'ANDROID', 'IOS', 'DESIGN', 'SERVER', 'UNASSIGNED'];

const STATUS_TABS: { value: AttendanceStatus | ''; label: string }[] = [
	{ value: '', label: '전체' },
	{ value: 'PRESENT', label: '출석' },
	{ value: 'LATE', label: '지각' },
	{ value: 'ABSENT', label: '결석' },
	{ value: 'EXCUSED_ABSENT', label: '인정' },
	{ value: 'PENDING', label: '미출석' },
];

export function AttendanceSessionFilters({
	members,
	statusMembers,
	teams,
	parts,
	myTeamNumber,
	filters,
	onChange,
}: AttendanceSessionFiltersProps) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<Record<string, string[]>>({});
	const selectedTeams = filters.teams?.split(',') ?? [];
	const selectedParts = filters.parts?.split(',') ?? [];
	const hasFilters = Boolean(
		filters.name || filters.status || filters.myTeam || filters.teams || filters.parts,
	);
	const availableMembers = members.filter(
		(member) =>
			(!filters.name || member.name.includes(filters.name.trim())) &&
			(!filters.status || member.attendanceStatus === filters.status) &&
			(filters.myTeam !== 'true' || (myTeamNumber !== null && member.teamNumber === myTeamNumber)),
	);

	const partOptions = PART_ORDER.filter((part) => parts.includes(part)).map((part) => ({
		value: part,
		label:
			part === 'UNASSIGNED' ? '미배정' : part === 'ANDROID' ? 'Android' : getMemberPartLabel(part),
		disabled:
			!draft.파트별?.includes(part) &&
			!availableMembers.some(
				(member) =>
					(member.part ?? 'UNASSIGNED') === part &&
					(!draft.팀별?.length ||
						draft.팀별.includes(
							member.teamNumber === null ? 'UNASSIGNED' : String(member.teamNumber),
						)),
			),
	}));
	const teamOptions = [
		...teams.map((team) => ({
			value: String(team.number),
			label: `${team.number}팀`,
		})),
		{ value: 'UNASSIGNED', label: '미배정' },
	].map((team) => ({
		...team,
		disabled:
			!draft.팀별?.includes(team.value) &&
			!availableMembers.some(
				(member) =>
					(member.teamNumber === null ? 'UNASSIGNED' : String(member.teamNumber)) === team.value &&
					(!draft.파트별?.length || draft.파트별.includes(member.part ?? 'UNASSIGNED')),
			),
	}));

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 px-10 pt-6 pb-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="flex h-10 overflow-x-auto rounded-md ring-1 ring-line-normal ring-inset">
					{STATUS_TABS.map((status) => {
						const count = status.value
							? statusMembers.filter((member) => member.attendanceStatus === status.value).length
							: statusMembers.length;
						return (
							<button
								key={status.value}
								type="button"
								disabled={count === 0}
								onClick={() => onChange({ status: status.value })}
								className={cn(
									'h-10 w-17.5 shrink-0 whitespace-nowrap border-line-normal border-r font-medium text-body2 last:border-0 disabled:cursor-not-allowed disabled:opacity-40',
									(filters.status ?? '') === status.value
										? 'bg-primary-extralight text-primary-normal'
										: 'text-label-assistive',
								)}
							>
								{status.label} {count}
							</button>
						);
					})}
				</div>
				<div className="flex h-10 w-50 items-center gap-2 rounded-lg border border-line-normal bg-background-normal px-4">
					<input
						value={filters.name ?? ''}
						onChange={(event) => onChange({ name: event.target.value })}
						placeholder="디퍼 검색"
						className="min-w-0 flex-1 bg-transparent font-medium text-body2 outline-none placeholder:text-label-assistive"
					/>
					{filters.name ? (
						<Button
							type="button"
							variant="none"
							size="none"
							title="검색 초기화"
							onClick={() => onChange({ name: '' })}
							className="size-4 rounded-full bg-background-strong text-label-assistive"
						>
							<X className="size-3" />
						</Button>
					) : (
						<Search className="size-4 shrink-0 text-label-assistive" />
					)}
				</div>
			</div>
			<div className="flex items-center gap-2">
				{hasFilters ? (
					<Button
						type="button"
						variant="text"
						size="none"
						title="필터 초기화"
						className="size-8"
						onClick={() => onChange({ name: '', status: '', myTeam: '', teams: '', parts: '' })}
					>
						<RotateCcw className="size-5" />
					</Button>
				) : null}
				<label
					htmlFor="attendance-my-team"
					className="flex h-10 cursor-pointer items-center gap-1.5 rounded-md border border-line-normal px-3 font-medium text-body2 text-label-assistive"
				>
					<TableCheckbox
						className="size-4"
						id="attendance-my-team"
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
						if (value) setDraft({ 파트별: selectedParts, 팀별: selectedTeams });
					}}
				>
					<div className="flex gap-2">
						{[
							{ label: '팀별', values: selectedTeams, options: teamOptions },
							{ label: '파트별', values: selectedParts, options: partOptions },
						].map(({ label, values, options }) => (
							<PopoverTrigger key={label} asChild>
								<button
									type="button"
									className={cn(
										'flex h-10 items-center gap-1 rounded-lg border border-line-normal px-3 font-medium text-body2 text-label-assistive',
										values.length > 0 && 'border-primary-normal text-primary-normal',
									)}
								>
									{values.length
										? options.find((option) => option.value === values[0])?.label
										: label}
									{values.length > 1 ? ` 외 ${values.length - 1}` : ''}
									<ChevronDown className="size-3" />
								</button>
							</PopoverTrigger>
						))}
					</div>
					<PopoverContent align="end" className="w-auto border-0 p-0 shadow-none">
						<AttendanceFilterPopover
							sections={[
								{ label: '파트별', options: partOptions },
								{ label: '팀별', options: teamOptions },
							]}
							selectedValues={draft}
							onClose={() => setOpen(false)}
							onReset={() => setDraft({})}
							onFilterChange={(section, value) =>
								setDraft((values) => ({
									...values,
									[section]: values[section]?.includes(value)
										? values[section].filter((item) => item !== value)
										: [...(values[section] ?? []), value],
								}))
							}
							onApply={() => {
								onChange({
									teams: (draft.팀별 ?? []).join(','),
									parts: (draft.파트별 ?? []).join(','),
								});
								setOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
