'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Button } from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance/EmptyView';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useCheckboxSelection } from '@/hooks/useCheckboxSelection';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useIntersect } from '@/hooks/useIntersect';
import { getAttendanceBySessionOptions } from '@/remotes/queries/attendance';
import { getSessionWeeks } from '@/remotes/queries/session';

import { AttendanceFilter } from '../../_components/attendance-filter';
import { SearchInput } from '../../_components/search-input';
import { WeekFilter } from '../../_components/week-filter';
import AttendanceList from './attendance-list';

const AttendanceSessionContainer = () => {
	const {
		data: { data },
	} = useSuspenseQuery(getSessionWeeks());

	const customSearchParams = useCustomSearchParams();
	const selectedWeekId = customSearchParams.get('week');

	const selectedSession = useMemo(() => {
		return data.sessions?.find((session) => session.id.toString() === selectedWeekId);
	}, [data.sessions, selectedWeekId]);

	// 출석 데이터 조회
	const searchParams = customSearchParams.getAll();
	const attendanceSearchParams = useMemo(
		() => ({
			week: Number(searchParams.week),
			statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
			teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
			onlyMyTeam: searchParams.onlyMyTeam === 'true' ? true : undefined,
			name: searchParams.name,
		}),
		[searchParams],
	);

	const {
		data: attendanceData,
		fetchNextPage,
		hasNextPage,
		fetchStatus,
		isLoading,
	} = useInfiniteQuery(getAttendanceBySessionOptions(attendanceSearchParams));

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

	const flatData = attendanceData?.pages.flatMap((page) => page.data.members) ?? [];

	const { selectedIds, toggleItem, toggleAll, isAllSelected, clearSelection } =
		useCheckboxSelection(flatData);

	useEffect(() => {
		if (attendanceSearchParams.week) {
			clearSelection();
		}
	}, [attendanceSearchParams.week, clearSelection]);

	const handleModifyAttendance = () => {
		// TODO: 출석 정보 수정 로직 구현
		console.log('선택된 멤버 IDs:', Array.from(selectedIds));
	};

	if (data?.sessions?.length === 0) {
		return <EmptyView message="현재 조회된 세션 정보가 없습니다" />;
	}

	if (isLoading) {
		return <LoadingBox />;
	}

	return (
		<>
			{/* Mobile view (< 768px) */}
			<div className="md:hidden">
				<section className="sticky top-0 space-y-3.5 bg-white px-4 py-2.5">
					<WeekFilter weeks={data.sessions} />
					<SearchInput placeholder="디퍼 검색" />
					<AttendanceFilter />
				</section>
				<AttendanceList
					data={flatData}
					targetRef={targetRef}
					selectedIds={selectedIds}
					onToggleItem={toggleItem}
					onToggleAll={toggleAll}
					isAllSelected={isAllSelected}
				/>
			</div>

			{/* Desktop view (>= 768px) */}
			<div className="hidden md:block">
				<section className="border-gray-200 border-b bg-white px-10 py-4">
					<WeekFilter weeks={data.sessions} />
				</section>

				<section className="bg-white px-10 py-6">
					<div className="mb-4 flex items-center gap-2">
						<h2 className="font-bold text-label-normal text-title1 tracking-[-0.2px]">
							출석 {selectedSession?.week}주차 (데이터 필요)
						</h2>
						<span className="font-medium text-body1 text-primary-normal">데이터 필요</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="w-[270px]">
							<SearchInput placeholder="디퍼 검색" />
						</div>
						<div className="flex items-center gap-[30px]">
							{selectedIds.size > 0 && (
								<div className="flex items-center gap-3">
									<p className="font-medium text-body1 text-primary-normal">
										{selectedIds.size}개 선택됨
									</p>
									<Button
										variant="none"
										size="none"
										onClick={handleModifyAttendance}
										className="rounded-lg bg-background-inverse px-4 py-3 font-semibold text-body2 text-label-inverse"
									>
										출석 정보 수정
									</Button>
								</div>
							)}
							<AttendanceFilter />
						</div>
					</div>
				</section>

				<AttendanceList
					data={flatData}
					targetRef={targetRef}
					selectedIds={selectedIds}
					onToggleItem={toggleItem}
					onToggleAll={toggleAll}
					isAllSelected={isAllSelected}
				/>
			</div>
		</>
	);
};

export const AttendanceSession = () => {
	return (
		<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
			<Suspense>
				<AttendanceSessionContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
