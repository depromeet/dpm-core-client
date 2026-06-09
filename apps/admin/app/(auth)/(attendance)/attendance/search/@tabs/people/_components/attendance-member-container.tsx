'use client';

import { Suspense, useMemo } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
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

	const rawData = data?.pages.flatMap((page) => page.data.members) ?? [];
	const totalElements = data?.pages[0]?.data.totalElements ?? 0;

	// TODO: 백엔드 API 구현 후 아래 mock 제거 및 rawData → flatData 직접 사용
	const MOCK_STATUSES = ['SUBMITTED', 'SUBMITTED', 'PENDING', null, null] as const;
	const flatData = rawData.map((member, index) => ({
		...member,
		excuseDocumentStatus: MOCK_STATUSES[index % MOCK_STATUSES.length],
	}));

	// 초기 로딩만 전체 LoadingBox 표시
	if (isLoading && !data) {
		return <LoadingBox />;
	}

	return (
		<>
			{/* Mobile view (< 768px) */}
			<div className="md:hidden">
				<section className="sticky top-0 z-10 space-y-3.5 bg-white px-4 py-2.5">
					<SearchInput placeholder="디퍼 검색" />
					<AttendanceFilter />
				</section>
				<AttendanceList data={flatData} targetRef={targetRef} />
			</div>

			{/* Desktop view (>= 768px) */}
			<div className="hidden w-full md:mx-auto md:block md:max-w-300">
				<section className="bg-white px-10 py-6">
					<div className="mb-4 flex items-center gap-2">
						<h2 className="font-bold text-label-normal text-title1 tracking-[-0.2px]">
							사람별 출석
						</h2>
						<span className="font-medium text-body1 text-primary-normal">{totalElements}명</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="w-67.5">
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
		<ErrorBoundary
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense>
				<AttendanceMemberContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
