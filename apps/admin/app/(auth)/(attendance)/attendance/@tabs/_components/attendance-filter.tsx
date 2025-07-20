'use client';

import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import {
	Button,
	Checkbox,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	FilterChip,
	cn,
} from '@dpm-core/shared';
import { Label } from '@radix-ui/react-label';
import { ChevronDownIcon, RotateCw } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { SearchInput } from './search-input';

/* 
  서버에 따라서 변경될 예정
  검색 - name 
  출석상태별 - attendance_statuses
  팀별 - teams
  수료상태별 - completion_statuses
  주차별 - week
  다음페이지 정보 - cursor_id
*/

const ATTENDANCE_FILTER = ['출석', '지각', '인정', '결석', '미출석'];
const TEAM_FILTER = ['1', '2', '3', '4', '5', '6'];

export const AttendanceFilter = () => {
	const customSearchParams = useCustomSearchParams();

	const filterChipRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const handleSelectFilter = () => {
		const checkedIds = filterChipRefs.current
			.filter((chip) => chip?.ariaChecked === 'true')
			.map((chip) => chip?.id);

		customSearchParams.update({ attendance_statuses: checkedIds.toString() }, 'REPLACE');
	};

	const selectedAttendanceStatuses =
		customSearchParams.get('attendance_statuses')?.split(',').filter(Boolean) ?? [];

	const attendanceFilterLabel = useMemo(() => {
		if (selectedAttendanceStatuses.length === 0) return '출석상태별';
		if (selectedAttendanceStatuses.length === 1) return selectedAttendanceStatuses[0];
		return `${selectedAttendanceStatuses[0]} 외 ${selectedAttendanceStatuses.length - 1}개`;
	}, [selectedAttendanceStatuses]);

	return (
		<>
			<SearchInput id="search-input" />
			{/* Select Bottom Sheet */}
			<div className="flex justify-between items-center">
				<Drawer>
					<div className="flex gap-2">
						<DrawerTrigger asChild>
							<Button
								size="xs"
								className={cn(
									'bg-background-normal rounded-lg text-label-assistive border border-line-subtle h-7 gap-1 text-body2 font-medium hover:bg-inherit',
									attendanceFilterLabel !== '출석상태별' &&
										'border-primary-normal text-primary-normal',
								)}
							>
								{attendanceFilterLabel}
								<ChevronDownIcon className="size-5 text-icon-noraml" />
							</Button>
						</DrawerTrigger>
						<DrawerTrigger asChild>
							<Button
								size="xs"
								className="bg-background-normal rounded-lg text-label-assistive border border-line-subtle h-7 gap-1 text-body2 font-medium hover:bg-inherit"
							>
								팀별
								<ChevronDownIcon className="size-5 text-icon-noraml" />
							</Button>
						</DrawerTrigger>
					</div>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>필터</DrawerTitle>
						</DrawerHeader>
						<div className="px-6 mt-8">
							<p className="text-label-normal text-body1 font-semibold mb-2">출석 상태별</p>
							<div className="flex gap-2 flex-wrap">
								{ATTENDANCE_FILTER.map((chip, index) => {
									const selected = customSearchParams
										.get('attendance_statuses')
										?.split(',')
										.includes(chip);

									return (
										<FilterChip
											key={chip}
											id={chip}
											defaultChecked={selected}
											ref={(el) => {
												filterChipRefs.current[index] = el;
											}}
										>
											{chip}
										</FilterChip>
									);
								})}
							</div>
						</div>
						<div className="px-6 mt-7.5 mb-40">
							<p className="text-label-normal text-body1 font-semibold mb-2">팀별</p>
							<div className="flex gap-2 flex-wrap">
								{TEAM_FILTER.map((chip) => (
									<FilterChip key={chip} id={chip}>
										{chip}팀
									</FilterChip>
								))}
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
												attendance_statuses: '',
												completion_statuses: '',
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
				{/* 체크박스 */}
				<div className="flex items-center gap-1.5">
					<Checkbox
						onCheckedChange={(checked) =>
							customSearchParams.update({ myteam: checked ? 'true' : '' }, 'REPLACE')
						}
						className="size-4 border-line-noraml rounded-sm text-gray-0 data-[state=checked]:bg-primary-normal"
					/>
					<Label className="text-label-assistive text-body2 font-medium">내 팀만 보기</Label>
				</div>
			</div>
		</>
	);
};
