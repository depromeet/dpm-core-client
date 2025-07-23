'use client';

import { Button, ChevronLeft } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { getAttendanceByMemberDetailOptions } from '@/remotes/queries/attendance';
import { AttendanceMemberInfo } from './attendance-member-info';
import { AttendanceSessionList } from './attendance-session-list';

interface AttendanceMemberDetailContainerProps {
	memberId: number;
}

export const _AttendanceMemberDetailContainer = (props: AttendanceMemberDetailContainerProps) => {
	const { memberId } = props;
	const router = useRouter();

	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceByMemberDetailOptions({ memberId }));

	return (
		<>
			<header className="h-12 bg-gray-0 sticky top-0 py-3 px-4 flex items-center justify-between">
				<Button variant="none" size="none" onClick={() => router.back()} asChild>
					<ChevronLeft />
				</Button>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">
					{data.member.name}
				</h1>
			</header>

			<AttendanceMemberInfo attendance={data.attendance} member={data.member} />
			<AttendanceSessionList memberId={memberId} sessions={data.sessions} />
		</>
	);
};

export const AttendanceMemberDetailContainer = (props: AttendanceMemberDetailContainerProps) => {
	const { memberId } = props;

	return (
		<ErrorBoundary fallback>
			<Suspense>
				<_AttendanceMemberDetailContainer memberId={memberId} />
			</Suspense>
		</ErrorBoundary>
	);
};
