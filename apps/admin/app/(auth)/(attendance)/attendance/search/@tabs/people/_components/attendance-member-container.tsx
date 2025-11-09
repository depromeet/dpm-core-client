'use client';

import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getAttendanceByMemberOptions } from '@/remotes/queries/attendance';

import { AttendanceFilter } from '../../_components/attendance-filter';
import { SearchInput } from '../../_components/search-input';
import { AttendanceList } from './attendance-list';

const AttendanceMemberContainer = () => {
	const customSearchParams = useCustomSearchParams();

	const searchParams = customSearchParams.getAll();
	const attendanceSearchParams = useMemo(
		() => ({
			statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
			teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
			onlyMyTeam: searchParams.onlyMyTeam === 'true' ? true : undefined,
			name: searchParams.name,
		}),
		[searchParams],
	);

	const { data, fetchNextPage, hasNextPage, fetchStatus, isLoading } = useInfiniteQuery(
		getAttendanceByMemberOptions(attendanceSearchParams),
	);

	const { targetRef } = useInfiniteScroll({
		callback: fetchNextPage,
		canObserve: hasNextPage,
		enabled: fetchStatus !== 'fetching',
	});

	const flatData = data?.pages.flatMap((page) => page.data.members) ?? [];

	// 초기 로딩만 전체 LoadingBox 표시
	if (isLoading && !data) {
		return <LoadingBox />;
	}

	return (
		<>
			{/* Mobile view (< 768px) */}
			<div className="md:hidden">
				<section className="sticky top-0 space-y-3.5 bg-white px-4 py-2.5">
					<SearchInput placeholder="디퍼 검색" />
					<AttendanceFilter />
				</section>
				<AttendanceList data={flatData} targetRef={targetRef} />
			</div>

			{/* Desktop view (>= 768px) */}
			<div className="hidden md:block">
				<section className="bg-white px-10 py-6">
					<div className="mb-4 flex items-center gap-2">
						<h2 className="font-bold text-label-normal text-title1 tracking-[-0.2px]">
							사람별 출석
						</h2>
						<span className="font-medium text-body1 text-primary-normal">데이터 필요</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="w-[270px]">
							<SearchInput placeholder="디퍼 검색" />
						</div>
						<AttendanceFilter />
					</div>
				</section>

				<AttendanceList data={flatData} targetRef={targetRef} />
			</div>
		</>
	);
};

export const AttendanceMember = () => {
	return (
		<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
			<Suspense>
				<AttendanceMemberContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
