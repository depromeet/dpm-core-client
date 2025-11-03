'use client';

import { Badge } from '@dpm-core/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

import { EmptyView } from '@/components/attendance/EmptyView';
import { Profile } from '@/components/attendance/profile';
import { LoadingBox } from '@/components/loading-box';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useIntersect } from '@/hooks/useIntersect';
import { getAttendanceMemberStatusLabel } from '@/lib/attendance/status';
import { getAttendanceByMemberOptions } from '@/remotes/queries/attendance';

import { AttendanceMemberDetailDrawer } from './attendance-member-detail-drawer';

export const AttendanceList = () => {
	const customSearchParams = useCustomSearchParams();

	const searchParams = customSearchParams.getAll();
	const attendanceSearchParams = {
		statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
		teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
		onlyMyTeam: searchParams.onlyMyTeam === 'true' ? true : undefined,
		name: searchParams.name,
	};

	const { data, fetchNextPage, hasNextPage, fetchStatus, isLoading } = useInfiniteQuery(
		getAttendanceByMemberOptions(attendanceSearchParams),
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

	const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleDesktopRowClick = (memberId: number) => {
		setSelectedMemberId(memberId);
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
			{/* Mobile view (< 768px) */}
			<section className="mt-2 mb-15 flex-1 flex-col px-4 md:hidden">
				{flatData.map((member) => {
					return (
						<Link
							href={`/attendance/${member.id}`}
							className="flex items-center justify-between py-3"
							key={member.id}
						>
							<Profile
								size={40}
								name={member.name}
								teamNumber={member.teamNumber}
								part={member.part}
							/>
							{member.attendanceStatus !== 'NORMAL' && (
								<Badge variant={member.attendanceStatus}>
									{getAttendanceMemberStatusLabel(member.attendanceStatus)}
								</Badge>
							)}
						</Link>
					);
				})}
				<div ref={targetRef} />
			</section>

			{/* Desktop view (>= 768px) */}
			<section className="mx-10 mb-15 hidden md:block">
				<div className="overflow-auto">
					<div className="flex items-center justify-between border-gray-200 border-b bg-gray-50 py-2.5 pr-[136px] pl-5">
						<span className="font-medium text-body2 text-label-subtle">멤버 정보</span>
						<span className="font-medium text-body2 text-label-subtle">수료 상태</span>
					</div>

					{flatData.map((member) => {
						return (
							<button
								key={member.id}
								type="button"
								onClick={() => handleDesktopRowClick(member.id)}
								className="flex w-full cursor-pointer items-center justify-between border-gray-200 border-b py-5 pr-[136px] pl-5 text-left transition-colors hover:bg-gray-50"
							>
								<Profile
									size={40}
									name={member.name}
									teamNumber={member.teamNumber}
									part={member.part}
								/>
								<Badge variant={member.attendanceStatus}>
									{getAttendanceMemberStatusLabel(member.attendanceStatus)}
								</Badge>
							</button>
						);
					})}
				</div>
				<div ref={targetRef} />

				{/* Drawer for desktop */}
				{selectedMemberId && (
					<AttendanceMemberDetailDrawer
						memberId={selectedMemberId}
						open={isDrawerOpen}
						onOpenChange={setIsDrawerOpen}
					/>
				)}
			</section>
		</>
	);
};
