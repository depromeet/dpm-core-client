'use client';

import { ErrorBoundary } from '@suspensive/react';
import { Suspense } from 'react';

import { ErrorBox } from '@/components/error-box';

import { AttendanceFilter } from '../../_components/attendance-filter';
import { SearchInput } from '../../_components/search-input';
import { AttendanceList } from './attendance-list';

const AttendanceMemberContainer = () => {
	return (
		<>
			{/* Mobile view (< 768px) - 기존 레이아웃 유지 */}
			<div className="md:hidden">
				<section className="sticky top-0 space-y-3.5 bg-white px-4 py-2.5">
					<SearchInput placeholder="디퍼 검색" />
					<AttendanceFilter />
				</section>
				<AttendanceList />
			</div>

			{/* Desktop view (>= 768px) - 새로운 레이아웃 */}
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

				<AttendanceList />
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
