'use client';

import { Badge } from '@dpm-core/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { EmptyView } from '@/components/attendance/EmptyView';
import { Profile } from '@/components/attendance/profile';
import { LoadingBox } from '@/components/loading-box';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useIntersect } from '@/hooks/useIntersect';
import { getAttendanceMemberStatus } from '@/lib/attendance/status';
import { getAttendanceByMemberOptions } from '@/remotes/queries/attendance';

export const AttendanceList = () => {
	const customSearchParams = useCustomSearchParams();

	const searchParams = customSearchParams.getAll();
	const attendanceSearchParams = {
		statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
		teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
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

	if (isLoading) {
		return <LoadingBox />;
	}

	if (flatData.length === 0) {
		return <EmptyView message="조건에 맞는 디퍼를 찾을 수 없어요" />;
	}

	return (
		<section className="px-4 mt-2">
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
						<Badge variant={member.attendanceStatus}>
							{getAttendanceMemberStatus(member.attendanceStatus)}
						</Badge>
					</Link>
				);
			})}
			<div ref={targetRef} />
		</section>
	);
};
