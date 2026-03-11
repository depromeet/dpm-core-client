'use client';

import { Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { ApiResponse, AttendanceReponse } from '@dpm-core/api';
import { Aesterisk } from '@dpm-core/shared';

import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getAttendanceMeOptions } from '@/remotes/queries/attendance';

import { AttendanceSessionList } from './attendance-session-list';
import { AttendanceMeInfo } from './attendance-situation-info';

const AttendanceMeContainer = () => {
	const { data: response } = useSuspenseQuery(getAttendanceMeOptions());

	if (response.isError) {
		return (
			<Empty className="h-full min-h-41.5">
				<EmptyHeader>
					<Aesterisk />
					<EmptyTitle>세션이 준비중이에요</EmptyTitle>
				</EmptyHeader>
			</Empty>
		);
	}

	const { data } = response as ApiResponse<AttendanceReponse>;

	return (
		<div className="scrollbar-hide flex-1 overflow-auto">
			<AttendanceMeInfo attendance={data.attendance} member={data.member} />
			<AttendanceSessionList sessions={data.sessions} />
		</div>
	);
};

export const AttendanceMe = () => {
	return (
		<ErrorBoundary
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceMeContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
