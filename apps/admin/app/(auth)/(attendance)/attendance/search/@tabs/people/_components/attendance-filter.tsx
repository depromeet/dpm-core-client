'use client';

import {
  Button,
  Checkbox,
  cn,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  FilterChip,
  Label,
} from '@dpm-core/shared';

import { ChevronDownIcon, RotateCw } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

// const ATTENDANCE_FILTER = [
// 	{ label: '수료 불가', value: 'IMPOSSIBLE' },
// 	{ label: '수료 위험', value: 'AT_RISK' },
// 	{ label: '수료 가능', value: 'NORMAL' },
// ];

const TEAM_FILTER = ['1', '2', '3', '4', '5', '6'];

export const AttendanceFilter = () => {
	const customSearchParams = useCustomSearchParams();

	// const filterChipRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const teamsFilterChipRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const handleSelectFilter = () => {
		// const filterChipIds = filterChipRefs.current
		// 	.filter((chip) => chip?.ariaChecked === 'true')
		// 	.map((chip) => chip?.id);

		const teamFilterChipIds = teamsFilterChipRefs.current
			.filter((chip) => chip?.ariaChecked === 'true')
			.map((chip) => chip?.id);

		const hasSelectedTeams = teamFilterChipIds.length > 0;
		const existingOnlyMyTeam = customSearchParams.get('onlyMyTeam');
		const onlyMyTeamParams = hasSelectedTeams ? '' : (existingOnlyMyTeam ?? '');

		customSearchParams.update(
			{
				// statuses: filterChipIds.toString(),
				teams: teamFilterChipIds.toString(),
				onlyMyTeam: onlyMyTeamParams,
			},
			'REPLACE',
		);
	};

	// const selectedAttendanceStatuses =
	// 	customSearchParams.get('statuses')?.split(',').filter(Boolean) ?? [];

	// const attendanceFilterLabel = useMemo(() => {
	// 	if (selectedAttendanceStatuses.length === 0) return '수료 상태별';
	// 	if (selectedAttendanceStatuses.length === 1)
	// 		return getAttendanceMemberStatusLabel(
	// 			selectedAttendanceStatuses[0] as MemberAttendanceStatus,
	// 		);
	// 	return `${getAttendanceMemberStatusLabel(selectedAttendanceStatuses[0] as MemberAttendanceStatus)} 외 ${selectedAttendanceStatuses.length - 1}`;
	// }, [selectedAttendanceStatuses]);

	const selectedTeams = customSearchParams.get('teams')?.split(',').filter(Boolean) ?? [];

	const teamsFilterLabel = useMemo(() => {
		if (selectedTeams.length === 0) return '팀별';

		if (selectedTeams.length === 1) return `${selectedTeams[0]}팀`;
		return `${selectedTeams[0]}팀 외 ${selectedTeams.length - 1}`;
	}, [selectedTeams]);

	return (
		<div className="flex justify-between items-center">
			<Drawer>
				<div className="flex gap-2">
					{/* <DrawerTrigger asChild>
						<Button
							size="none"
							className={cn(
								'bg-background-normal rounded-lg text-label-assistive border border-line-normal py-1 px-2.5 gap-1 text-body2 font-medium hover:bg-inherit',
								attendanceFilterLabel !== '수료 상태별' &&
									'border-primary-normal text-primary-normal',
							)}
						>
							{attendanceFilterLabel}
							<ChevronDownIcon className="size-5 text-icon-noraml" />
						</Button>
					</DrawerTrigger> */}
					<DrawerTrigger asChild>
						<Button
							size="none"
							className={cn(
								'bg-background-normal rounded-lg text-label-assistive border border-line-normal py-1 px-2.5 gap-1 text-body2 font-medium hover:bg-inherit',
								teamsFilterLabel !== '팀별' && 'border-primary-normal text-primary-normal',
							)}
						>
							{teamsFilterLabel}
							<ChevronDownIcon className="size-5 text-icon-noraml" />
						</Button>
					</DrawerTrigger>
				</div>
				<DrawerContent className="mx-auto max-w-lg">
					<DrawerHeader>
						<DrawerTitle>필터</DrawerTitle>
					</DrawerHeader>
					{/* <div className="px-6 mt-8">
						<p className="text-label-normal text-body1 font-semibold mb-2">수료 상태별</p>
						<div className="flex gap-2 flex-wrap">
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
					</div> */}
					<div className="px-6 mt-7.5 mb-40">
						<p className="text-label-normal text-body1 font-semibold mb-2">팀별</p>
						<div className="flex gap-2 flex-wrap">
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
								className="bg-background-strong p-3.5 flex items-center rounded-lg"
								onClick={() =>
									customSearchParams.update(
										{
											// statuses: '',
											teams: '',
										},
										'REPLACE',
									)
								}
							>
								<RotateCw className="text-icon-noraml size-5" />
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
					id="my-team"
					checked={customSearchParams.get('onlyMyTeam') === 'true' && true}
					onCheckedChange={(checked) =>
						customSearchParams.update({ onlyMyTeam: checked ? 'true' : '', teams: '' }, 'REPLACE')
					}
					className="size-4 border-line-normal rounded-sm text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
				/>
				<Label htmlFor="my-team" className="text-label-assistive text-body2 font-medium">
					내 팀만 보기
				</Label>
			</div>
		</div>
	);
};
