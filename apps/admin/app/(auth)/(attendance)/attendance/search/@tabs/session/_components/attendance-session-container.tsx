'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Button } from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance/EmptyView';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useCheckboxSelection } from '@/hooks/useCheckboxSelection';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { formatISOStringToDate } from '@/lib/date';
import { getAttendanceBySessionOptions } from '@/remotes/queries/attendance';
import { getSessionWeeks } from '@/remotes/queries/session';

import { AttendanceFilter } from '../../_components/attendance-filter';
import { SearchInput } from '../../_components/search-input';
import { WeekFilter } from '../../_components/week-filter';
import { AttendanceBulkModifyModal } from './attendance-bulk-modify-modal';
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

	const searchParams = customSearchParams.getAll();
	const attendanceSearchParams = useMemo(
		() => ({
			week: Number(searchParams.week),
			statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
			teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
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

	const { targetRef } = useInfiniteScroll({
		callback: fetchNextPage,
		canObserve: hasNextPage,
		enabled: fetchStatus !== 'fetching',
	});

	const flatData = attendanceData?.pages.flatMap((page) => page.data.members) ?? [];
	const totalElements = attendanceData?.pages[0]?.data.totalElements ?? 0;

	const { selectedIds, toggleItem, toggleAll, isAllSelected, clearSelection } =
		useCheckboxSelection(flatData);

	useEffect(() => {
		if (attendanceSearchParams.week) {
			clearSelection();
		}
	}, [attendanceSearchParams.week, clearSelection]);

	const selectedMembers = useMemo(
		() => flatData.filter((member) => selectedIds.includes(member.id)),
		[flatData, selectedIds],
	);

	const [isBulkModifyModalOpen, setIsBulkModifyModalOpen] = useState(false);

	const handleModifyAttendance = () => {
		setIsBulkModifyModalOpen(true);
	};

	if (data?.sessions?.length === 0) {
		return <EmptyView message="현재 조회된 세션 정보가 없습니다" />;
	}

	// 초기 로딩만 전체 LoadingBox 표시
	if (isLoading && !attendanceData) {
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
			<div className="hidden md:mx-auto md:block md:max-w-[1200px]">
				<section className="border-gray-200 border-b bg-white px-10 py-4">
					<WeekFilter weeks={data.sessions} />
				</section>

				<section className="bg-white px-10 py-6">
					<div className="mb-4 flex items-center gap-2">
						<h2 className="font-bold text-label-normal text-title1 tracking-[-0.2px]">
							출석 {selectedSession?.week}주차 (
							{selectedSession?.date ? formatISOStringToDate(selectedSession.date) : '-'})
						</h2>
						<span className="font-medium text-body1 text-primary-normal">{totalElements}명</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="w-[270px]">
							<SearchInput placeholder="디퍼 검색" />
						</div>
						<div className="flex items-center gap-[30px]">
							{selectedIds.length > 0 && (
								<div className="flex items-center gap-3">
									<p className="font-medium text-body1 text-primary-normal">
										{selectedIds.length}개 선택됨
									</p>
									<Button
										variant="none"
										size="none"
										onClick={handleModifyAttendance}
										className="rounded-lg border-none bg-background-inverse px-4 py-2.5 font-semibold text-body2 text-label-inverse"
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

				<AttendanceBulkModifyModal
					sessionId={Number(searchParams.week)}
					selectedMembers={selectedMembers}
					open={isBulkModifyModalOpen}
					onOpenChange={setIsBulkModifyModalOpen}
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
