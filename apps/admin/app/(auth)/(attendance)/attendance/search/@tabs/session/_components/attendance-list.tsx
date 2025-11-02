import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { EmptyView } from '@/components/attendance/EmptyView';
import { Profile } from '@/components/attendance/profile';
import { LoadingBox } from '@/components/loading-box';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useIntersect } from '@/hooks/useIntersect';
import { getAttendanceBySessionOptions } from '@/remotes/queries/attendance';

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
			<section className="mb-15 mt-2 flex-1 flex-col px-4 md:hidden">
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
					<div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 py-2.5 pl-8 pr-[136px]">
						<span className="font-medium text-body2 text-label-subtle">멤버 정보</span>
						<span className="font-medium text-body2 text-label-subtle">출석 상태</span>
					</div>

					{/* 테이블 바디 */}
					{flatData.map((member) => {
						return (
							<Link
								href={`/attendance/${member.id}/${searchParams.week}`}
								key={member.id}
								className="flex items-center justify-between border-b border-gray-200 py-3 pl-8 pr-[136px] transition-colors hover:bg-gray-50"
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
				</div>
				<div ref={targetRef} />
			</section>
		</>
	);
};

export default AttendanceList;
