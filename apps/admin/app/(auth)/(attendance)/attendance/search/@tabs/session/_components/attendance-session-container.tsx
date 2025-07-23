'use client';

import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { EmptyView } from '@/components/attendance/EmptyView';
import { ErrorBox } from '@/components/error-box';
import { getSessionWeeks } from '@/remotes/queries/session';
import { AttendanceFilter } from '../../_components/attendance-filter';
import { SearchInput } from '../../_components/search-input';
import { WeekFilter } from '../../_components/week-filter';
import AttendanceList from './attendance-list';

const AttendanceSessionContainer = () => {
	const { data } = useSuspenseQuery(getSessionWeeks());

	if (data?.data.weeks.length === 0) {
		return <EmptyView message="현재 조회된 세션 정보가 없습니다" />;
	}

	return (
		<>
			<section className="px-4 py-2.5 space-y-3.5 sticky top-0 bg-white">
				<WeekFilter weeks={data?.data.weeks} />
				<SearchInput placeholder="디퍼 검색" />
				<AttendanceFilter />
			</section>

			<AttendanceList />
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
