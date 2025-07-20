'use client';

import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Fragment, Suspense } from 'react';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getAttendanceMeOptions } from '@/remotes/queries/attendance';
import { AttendanceSessionList } from './attendance-session-list';
import { AttendanceMeInfo } from './attendance-situation-info';

const AttendanceMeContainer = () => {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceMeOptions());

	return (
		<Fragment>
			<AttendanceMeInfo attendance={data.attendance} member={data.member} />
			<AttendanceSessionList sessions={data.sessions} />
		</Fragment>
	);
};

export const AttendanceMe = () => {
	return (
		<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceMeContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
