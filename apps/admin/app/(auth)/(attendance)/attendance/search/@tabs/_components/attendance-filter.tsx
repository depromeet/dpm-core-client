'use client';

import { useMemo, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import type { AttendanceStatus } from '@dpm-core/api';
import {
	Button,
	Checkbox,
	ChevronDown,
	cn,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	FilterChip,
	Label,
	XCircle,
} from '@dpm-core/shared';

import { useAuth } from '@/providers/auth-provider';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { getAttendanceStatusLabel } from '@/lib/attendance/status';

const ATTENDANCE_FILTER = [
	{ label: '출석', value: 'PRESENT' },
	{ label: '지각', value: 'LATE' },
	{ label: '인정', value: 'EXCUSED_ABSENT' },
	{ label: '결석', value: 'ABSENT' },
	{ label: '조퇴', value: 'EARLY_LEAVE' },
	{ label: '미출석', value: 'PENDING' },
] as const;
const TEAM_FILTER = ['1', '2', '3', '4', '5', '6'];

export const AttendanceFilter = () => {
	const { user } = useAuth();
	const customSearchParams = useCustomSearchParams();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const filterChipRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const teamsFilterChipRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const handleMyTeamToggle = (checked: boolean) => {
		customSearchParams.update(
			{
				onlyMyTeam: checked ? 'true' : '',
				teams: checked && user?.teamNumber ? user.teamNumber.toString() : '',
			},
			'REPLACE',
		);
	};

	const handleSelectFilter = () => {
		const filterChipIds = filterChipRefs.current
			.filter((chip) => chip?.ariaChecked === 'true')
			.map((chip) => chip?.id);

		const teamFilterChipIds = teamsFilterChipRefs.current
			.filter((chip) => chip?.ariaChecked === 'true')
			.map((chip) => chip?.id);

		const hasSelectedTeams = teamFilterChipIds.length > 0;
		const existingOnlyMyTeam = customSearchParams.get('onlyMyTeam');
		const onlyMyTeamParams = hasSelectedTeams ? '' : (existingOnlyMyTeam ?? '');

		customSearchParams.update(
			{
				statuses: filterChipIds.toString(),
				teams: teamFilterChipIds.toString(),
				onlyMyTeam: onlyMyTeamParams,
			},
			'REPLACE',
		);
	};

	const selectedAttendanceStatuses =
		customSearchParams.get('statuses')?.split(',').filter(Boolean) ?? [];

	const attendanceFilterLabel = useMemo(() => {
		if (selectedAttendanceStatuses.length === 0) return '출석 상태별';
		if (selectedAttendanceStatuses.length === 1)
			return getAttendanceStatusLabel(selectedAttendanceStatuses[0] as AttendanceStatus);
		return `${getAttendanceStatusLabel(selectedAttendanceStatuses[0] as AttendanceStatus)} 외 ${selectedAttendanceStatuses.length - 1}`;
	}, [selectedAttendanceStatuses]);

	const selectedTeams = customSearchParams.get('teams')?.split(',').filter(Boolean) ?? [];

	const teamsFilterLabel = useMemo(() => {
		if (selectedTeams.length === 0) return '팀별';

		if (selectedTeams.length === 1) return `${selectedTeams[0]}팀`;
		return `${selectedTeams[0]}팀 외 ${selectedTeams.length - 1}`;
	}, [selectedTeams]);

	return (
		<>
			{/* Mobile view (< 768px) */}
			<div className="flex items-center justify-between md:hidden">
				<Drawer>
					<div className="flex gap-2">
						<DrawerTrigger asChild>
							<Button
								size="none"
								className={cn(
									'gap-1 rounded-lg border border-line-normal bg-background-normal px-2.5 py-1 font-normal text-body2 text-label-assistive hover:bg-inherit',
									attendanceFilterLabel !== '출석 상태별' &&
										'border-primary-normal text-primary-normal',
								)}
							>
								{attendanceFilterLabel}
								<ChevronDown />
							</Button>
						</DrawerTrigger>
						<DrawerTrigger asChild>
							<Button
								size="none"
								className={cn(
									'gap-1 rounded-lg border border-line-normal bg-background-normal px-2.5 py-1 font-normal text-body2 text-label-assistive hover:bg-inherit',
									teamsFilterLabel !== '팀별' && 'border-primary-normal text-primary-normal',
								)}
							>
								{teamsFilterLabel}
								<ChevronDown />
							</Button>
						</DrawerTrigger>
					</div>
					<DrawerContent className="w-full">
						<DrawerHeader>
							<DrawerTitle>필터</DrawerTitle>
						</DrawerHeader>
						<div className="mt-8 px-6">
							<p className="mb-2 font-semibold text-body1 text-label-normal">출석 상태별</p>
							<div className="flex flex-wrap gap-2">
								{ATTENDANCE_FILTER.map((chip, index) => {
									const selected = customSearchParams
										.get('statuses')
										?.split(',')
										.includes(chip.value);
									return (
										<FilterChip
											key={chip.value}
											id={chip.value}
											defaultChecked={selected}
											ref={(el) => {
												filterChipRefs.current[index] = el;
											}}
										>
											{chip.label}
										</FilterChip>
									);
								})}
							</div>
						</div>
						<div className="mt-7.5 mb-40 px-6">
							<p className="mb-2 font-semibold text-body1 text-label-normal">팀별</p>
							<div className="flex flex-wrap gap-2">
								{TEAM_FILTER.map((chip, index) => {
									const selected = customSearchParams.get('teams')?.split(',').includes(chip);
									return (
										<FilterChip
											key={chip}
											id={chip}
											defaultChecked={selected}
											ref={(el) => {
												teamsFilterChipRefs.current[index] = el;
											}}
										>
											{chip}팀
										</FilterChip>
									);
								})}
							</div>
						</div>
						<DrawerFooter className="flex flex-row gap-2 px-4 py-3">
							<DrawerClose asChild>
								<Button
									variant="none"
									size="none"
									className="flex items-center rounded-lg bg-background-strong p-3.5"
									onClick={() =>
										customSearchParams.update(
											{
												statuses: '',
												teams: '',
											},
											'REPLACE',
										)
									}
								>
									<RotateCw className="size-5 text-icon-normal" />
								</Button>
							</DrawerClose>
							<DrawerClose asChild>
								<Button
									className="flex-1 rounded-lg"
									size="lg"
									variant="secondary"
									onClick={handleSelectFilter}
								>
									적용하기
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

				<div className="flex items-center gap-1.5">
					<Checkbox
						id="my-team-mobile"
						checked={customSearchParams.get('onlyMyTeam') === 'true' && true}
						onCheckedChange={handleMyTeamToggle}
						className="size-4 rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
					/>
					<Label htmlFor="my-team-mobile" className="font-normal text-body2 text-label-assistive">
						내 팀만 보기
					</Label>
				</div>
			</div>

			{/* Desktop view (>= 768px) */}
			<div className="hidden items-center gap-2 md:flex">
				<div
					className={cn(
						'flex items-center gap-1.5 rounded-lg border bg-white px-4 py-[9px]',
						customSearchParams.get('onlyMyTeam') === 'true'
							? 'border-primary-normal'
							: 'border-line-subtle',
					)}
				>
					<Checkbox
						id="my-team-desktop"
						checked={customSearchParams.get('onlyMyTeam') === 'true' && true}
						onCheckedChange={handleMyTeamToggle}
						className="size-4 rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
					/>
					<Label
						htmlFor="my-team-desktop"
						className="cursor-pointer font-normal text-body2 text-label-assistive"
					>
						내 팀만 보기
					</Label>
				</div>

				<DropdownMenu modal={false} open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
					<div className="flex gap-2">
						<DropdownMenuTrigger asChild>
							<Button
								size="none"
								className={cn(
									'h-10 gap-1 rounded-lg border border-line-subtle bg-white px-4 py-2.5 font-normal text-body2 text-label-assistive hover:bg-inherit',
									attendanceFilterLabel !== '출석 상태별' &&
										'border-primary-normal text-primary-normal',
								)}
							>
								{attendanceFilterLabel}
								<ChevronDown className="size-3" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuTrigger asChild>
							<Button
								size="none"
								className={cn(
									'h-10 gap-1 rounded-lg border border-line-subtle bg-white px-4 py-2.5 font-normal text-body2 text-label-assistive hover:bg-inherit',
									teamsFilterLabel !== '팀별' && 'border-primary-normal text-primary-normal',
								)}
							>
								{teamsFilterLabel}
								<ChevronDown className="size-3" />
							</Button>
						</DropdownMenuTrigger>
					</div>

					<DropdownMenuContent
						align="end"
						alignOffset={0}
						sideOffset={6}
						className="rounded-xl border-none bg-background-normal px-4 py-5 shadow-[0_-4px_21.1px_0_rgba(0,0,0,0.12)]"
					>
						<div className="flex items-center justify-between">
							<DropdownMenuLabel className="p-0 font-semibold text-title2">필터</DropdownMenuLabel>
							<XCircle className="cursor-pointer" onClick={() => setIsDropdownOpen(false)} />
						</div>
						<div className="mt-8">
							<p className="mb-2 font-semibold text-body1 text-label-normal">출석 상태별</p>
							<div className="flex flex-wrap gap-2">
								{ATTENDANCE_FILTER.map((chip, index) => {
									const selected = customSearchParams
										.get('statuses')
										?.split(',')
										.includes(chip.value);
									return (
										<FilterChip
											key={chip.value}
											id={chip.value}
											defaultChecked={selected}
											ref={(el) => {
												filterChipRefs.current[index] = el;
											}}
										>
											{chip.label}
										</FilterChip>
									);
								})}
							</div>
						</div>
						<div className="mt-7.5 mb-8">
							<p className="mb-2 font-semibold text-body1 text-label-normal">팀별</p>
							<div className="flex flex-wrap gap-2">
								{TEAM_FILTER.map((chip, index) => {
									const selected = customSearchParams.get('teams')?.split(',').includes(chip);
									return (
										<FilterChip
											key={chip}
											id={chip}
											defaultChecked={selected}
											ref={(el) => {
												teamsFilterChipRefs.current[index] = el;
											}}
										>
											{chip}팀
										</FilterChip>
									);
								})}
							</div>
						</div>

						<div className="flex gap-2">
							<DropdownMenuItem asChild>
								<Button
									variant="none"
									size="none"
									className="flex items-center rounded-lg bg-background-strong p-3.5"
									onClick={() =>
										customSearchParams.update(
											{
												statuses: '',
												teams: '',
											},
											'REPLACE',
										)
									}
								>
									<RotateCw className="size-5 text-icon-normal" />
								</Button>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Button
									className="flex-1 rounded-lg"
									size="lg"
									variant="secondary"
									onClick={handleSelectFilter}
								>
									적용하기
								</Button>
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};
