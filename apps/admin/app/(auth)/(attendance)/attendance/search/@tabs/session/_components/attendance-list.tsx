import { Checkbox } from '@dpm-core/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { EmptyView } from '@/components/attendance/EmptyView';
import { Profile } from '@/components/attendance/profile';
import { LoadingBox } from '@/components/loading-box';
import { useCheckboxSelection } from '@/hooks/useCheckboxSelection';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useIntersect } from '@/hooks/useIntersect';
import { getAttendanceBySessionOptions } from '@/remotes/queries/attendance';

import { AttendanceSessionDetailDrawer } from './attendance-session-detail-drawer';

const AttendanceList = () => {
	const customSearchParams = useCustomSearchParams();

	const searchParams = customSearchParams.getAll();
	const attendanceSearchParams = {
		week: Number(searchParams.week),
		statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
		teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
		onlyMyTeam: searchParams.onlyMyTeam === 'true' ? true : undefined,
		name: searchParams.name,
	};

	const { data, fetchNextPage, hasNextPage, fetchStatus, isLoading } = useInfiniteQuery(
		getAttendanceBySessionOptions(attendanceSearchParams),
	);

	const { targetRef } = useIntersect({
		onIntersect: (entry, observer) => {
			if (!hasNextPage) {
				observer.unobserve(entry.target);
				return;
			}

			if (entry.isIntersecting && hasNextPage && fetchStatus !== 'fetching') {
				fetchNextPage();
			}
		},
	});

	const flatData = data?.pages.flatMap((page) => page.data.members) ?? [];

	const { selectedIds, toggleItem, toggleAll, isAllSelected } = useCheckboxSelection(flatData);
	const [selectedMember, setSelectedMember] = useState<{ memberId: number; sessionId: number } | null>(
		null,
	);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleDesktopRowClick = (memberId: number) => {
		setSelectedMember({ memberId, sessionId: Number(searchParams.week) });
		setIsDrawerOpen(true);
	};

	if (isLoading) {
		return <LoadingBox />;
	}

	if (flatData.length === 0) {
		return (
			<div className="md:flex md:min-h-[400px] md:items-center md:justify-center">
				<EmptyView message="조건에 맞는 디퍼를 찾을 수 없어요" />
			</div>
		);
	}

	return (
		<>
			{/* Mobile view (< 768px) - 기존 리스트 */}
			<section className="mt-2 mb-15 flex-1 flex-col px-4 md:hidden">
				{flatData.map((member) => {
					return (
						<Link
							href={`/attendance/${member.id}/${searchParams.week}`}
							className="flex justify-between py-3"
							key={member.id}
						>
							<Profile
								size={40}
								name={member.name}
								teamNumber={member.teamNumber}
								part={member.part}
							/>
							<AttendanceStatusLabel status={member.attendanceStatus} />
						</Link>
					);
				})}
				<div ref={targetRef} />
			</section>

			{/* Desktop view (>= 768px) - 테이블 형태 */}
			<section className="mx-10 mb-15 hidden md:block">
				<div className="overflow-auto">
					{/* 테이블 헤더 */}
					<div className="flex items-center justify-between border-gray-200 border-b bg-gray-50 py-2.5 pr-[136px] pl-5">
						<div className="flex items-center gap-4">
							<Checkbox
								checked={isAllSelected}
								onCheckedChange={toggleAll}
								className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
								aria-label="전체 선택"
							/>
							<span className="font-medium text-body2 text-label-subtle">멤버 정보</span>
						</div>
						<span className="font-medium text-body2 text-label-subtle">출석 상태</span>
					</div>

					{/* 테이블 바디 */}
					{flatData.map((member) => {
						const isChecked = selectedIds.has(member.id);
						return (
							<button
								key={member.id}
								type="button"
								onClick={() => handleDesktopRowClick(member.id)}
								className="flex w-full cursor-pointer items-center justify-between border-gray-200 border-b py-5 pr-[136px] pl-5 text-left transition-colors hover:bg-gray-50"
							>
								<div className="flex items-center gap-4">
									<Checkbox
										checked={isChecked}
										onCheckedChange={() => toggleItem(member.id)}
										className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
										aria-label={`${member.name} 선택`}
										onClick={(e) => e.stopPropagation()}
									/>
									<Profile
										size={40}
										name={member.name}
										teamNumber={member.teamNumber}
										part={member.part}
									/>
								</div>
								<AttendanceStatusLabel status={member.attendanceStatus} />
							</button>
						);
					})}
				</div>
				<div ref={targetRef} />

				{/* Drawer for desktop */}
				{selectedMember && (
					<AttendanceSessionDetailDrawer
						memberId={selectedMember.memberId}
						sessionId={selectedMember.sessionId}
						open={isDrawerOpen}
						onOpenChange={setIsDrawerOpen}
					/>
				)}
			</section>
		</>
	);
};

export default AttendanceList;
