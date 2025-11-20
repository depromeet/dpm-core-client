'use client';

import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ChevronDown, ChevronRight, RotateCw } from 'lucide-react';
import type { AttendanceStatus, Session } from '@dpm-core/api';
import {
	Button,
	Checkbox,
	cn,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	FilterChip,
	Label,
	useIsMobile,
} from '@dpm-core/shared';

import { Section } from '@/components/section';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { getAttendanceStatusLabel } from '@/lib/attendance/status';
import { getPreviousSession } from '@/lib/session/getPreviousSession';
import { useAuth } from '@/providers/auth-provider';
import { getAttendanceBySessionOptions } from '@/remotes/queries/attendance';

import { SearchInput } from '../../(attendance)/attendance/search/@tabs/_components/search-input';
import { AttendanceList } from './attendance-list';
import { useSession } from './session-provider';

export const HomeAttendance = () => {
	const isMobile = useIsMobile();
	const { sessions, currentSessionWeek } = useSession();

	const prevSession = getPreviousSession(sessions, currentSessionWeek);

	if (!prevSession || isMobile) return null;

	return (
		<Section>
			<AttendanceHeader session={prevSession} />
			<div className="flex justify-between">
				<SearchInput
					placeholder="디퍼 검색"
					className="h-10 w-[270px] min-w-0 shrink-1 border border-line-normal bg-background-normal px-4 py-2.5 max-[800px]:w-[240px]"
				/>
				<AttendanceFilter />
			</div>

			<AttendanceList sessionId={prevSession.id} />
		</Section>
	);
};

const ATTENDANCE_FILTER = [
	{ label: '출석', value: 'PRESENT' },
	{ label: '지각', value: 'LATE' },
	{ label: '인정', value: 'EXCUSED_ABSENT' },
	{ label: '결석', value: 'ABSENT' },
	{ label: '미출석', value: 'PENDING' },
];

const TEAM_FILTER = Array.from({ length: 6 }, (_, i) => String(i + 1));

export const AttendanceFilter = () => {
	const customSearchParams = useCustomSearchParams();
	const { user } = useAuth();

	const filterChipRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const teamsFilterChipRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const myTeamNumber = user?.teamNumber?.toString() ?? '';
	const selectedTeams = customSearchParams.get('teams')?.split(',').filter(Boolean) ?? [];

	const isMyTeamOnly = selectedTeams.length === 1 && selectedTeams[0] === myTeamNumber;

	const handleMyTeamToggle = (checked: boolean) => {
		if (checked) {
			customSearchParams.update(
				{
					teams: myTeamNumber,
				},
				'REPLACE',
			);
		} else {
			customSearchParams.update(
				{
					teams: '',
				},
				'REPLACE',
			);
		}
	};

	const handleSelectFilter = () => {
		const filterChipIds = filterChipRefs.current
			.filter((chip) => chip?.ariaChecked === 'true')
			.map((chip) => chip?.id);

		const teamFilterChipIds = teamsFilterChipRefs.current
			.filter((chip) => chip?.ariaChecked === 'true')
			.map((chip) => chip?.id);

		customSearchParams.update(
			{
				statuses: filterChipIds.toString(),
				teams: teamFilterChipIds.toString(),
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

	const teamsFilterLabel = useMemo(() => {
		if (selectedTeams.length === 0) return '팀별';

		if (selectedTeams.length === 1) return `${selectedTeams[0]}팀`;
		return `${selectedTeams[0]}팀 외 ${selectedTeams.length - 1}`;
	}, [selectedTeams]);

	return (
		<div className="flex">
			<Label
				htmlFor="my-team"
				className={cn(
					'flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-line-normal px-4 py-2.5 font-medium text-body2 text-label-assistive transition',
					isMyTeamOnly ? 'border-primary-normal' : 'border-line-normal',
				)}
			>
				<Checkbox
					id="my-team"
					checked={isMyTeamOnly}
					onCheckedChange={handleMyTeamToggle}
					className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
				/>
				<span>내 팀만 보기</span>
			</Label>
			<DropdownMenu modal={false}>
				<div>
					<DropdownMenuTrigger asChild>
						<Button
							size="none"
							className={cn(
								'ml-2 h-10 gap-1 rounded-lg border border-line-normal bg-background-normal px-4 py-2.5 font-medium text-body2 text-label-assistive hover:bg-inherit',
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
								'ml-2 h-10 gap-1 rounded-lg border border-line-normal bg-background-normal px-4 py-2.5 font-medium text-body2 text-label-assistive hover:bg-inherit',
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
					className="w-[360px] rounded-xl border-none bg-background-normal px-4 py-5 shadow-[0_-4px_21.1px_0_rgba(0,0,0,0.12)]"
				>
					<DropdownMenuLabel className="p-0 font-semibold text-title2">필터</DropdownMenuLabel>
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
					<div className="mt-7.5 mb-5">
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
								className="flex cursor-pointer items-center rounded-lg bg-background-strong p-3.5"
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
								<RotateCw className="size-5 text-icon-noraml" />
							</Button>
						</DropdownMenuItem>

						<DropdownMenuItem asChild>
							<Button
								className="flex-1 cursor-pointer rounded-lg"
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
	);
};

interface AttendanceHeaderProps {
	session: Session;
}

const formatDate = (date: string) => {
	return dayjs(date).format('YYYY.MM.DD');
};

const AttendanceHeader = (props: AttendanceHeaderProps) => {
	const { session } = props;

	const customSearchParams = useCustomSearchParams();
	const searchParams = customSearchParams.getAll();

	const attendanceSearchParams = {
		week: session.id,
		statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
		teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
		name: searchParams.name,
	};

	const { data } = useInfiniteQuery(getAttendanceBySessionOptions(attendanceSearchParams));

	return (
		<div className="mb-4 flex items-center">
			<h3 className="font-bold text-label-normal text-title1">
				출석 {session.week}주차 ({formatDate(session.date)})
			</h3>
			<span className="ml-2 font-medium text-body1 text-primary-normal">
				{data?.pages[0].data.totalElements}
			</span>
			<Button variant="text" className="ml-3 gap-0" asChild>
				<Link href={`/attendance/search/session?week=${session.id}`}>
					전체보기
					<ChevronRight className="size-4" />
				</Link>
			</Button>
		</div>
	);
};
