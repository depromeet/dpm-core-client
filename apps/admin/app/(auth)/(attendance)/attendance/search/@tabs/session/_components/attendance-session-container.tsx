'use client';

import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';

import { EmptyView } from '@/components/attendance/EmptyView';
import { ErrorBox } from '@/components/error-box';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
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

	if (data?.sessions?.length === 0) {
		return <EmptyView message="현재 조회된 세션 정보가 없습니다" />;
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
				<AttendanceList />
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
						<AttendanceFilter />
					</div>
				</section>

				<AttendanceList />
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
