'use client';

import { Suspense } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useQueryErrorResetBoundary, useSuspenseQueries } from '@tanstack/react-query';
import type { Part } from '@dpm-core/api';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { getAttendanceByMemberOptions } from '@/remotes/queries/attendance';
import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';

import { AttendanceList } from './attendance-list';
import { AttendancePeopleFilters } from './attendance-people-filters';

const PART_ORDER: Exclude<Part, 'ETC'>[] = ['DESIGN', 'IOS', 'ANDROID', 'WEB', 'SERVER'];

function AttendanceMemberContainer() {
	const [
		{
			data: { data: roster },
		},
		{ data: teams },
	] = useSuspenseQueries({
		queries: [getAttendanceByMemberOptions(), getCurrentCohortTeamsQuery],
	});

	const params = useCustomSearchParams();

	const filters = params.getAll();
	const selectedTeams = filters.teams?.split(',') ?? [];
	const assignedMembers = roster.members.filter((member) => member.part !== null);
	const statusMembers = assignedMembers.filter(
		(member) =>
			(!filters.name || member.name.includes(filters.name.trim())) &&
			(!selectedTeams.length || selectedTeams.includes(String(member.teamNumber))) &&
			(filters.myTeam !== 'true' ||
				(roster.myTeamNumber !== null && member.teamNumber === roster.myTeamNumber)),
	);
	const members = statusMembers.filter(
		(member) => !filters.status || member.attendanceStatus === filters.status,
	);
	const updateFilters = (values: Record<string, string>) => {
		params.update(values, 'REPLACE');
	};
	return (
		<div className="flex h-dvh min-h-0 flex-col bg-background-normal">
			<header className="flex h-20 shrink-0 items-center gap-2 border-line-normal border-b px-10">
				<h1 className="font-bold text-label-normal text-title1">
					사람별 출석 <span className="text-primary-normal">{assignedMembers.length}</span>
				</h1>
			</header>
			<AttendancePeopleFilters
				members={assignedMembers}
				statusMembers={statusMembers}
				myTeamNumber={roster.myTeamNumber}
				teams={teams}
				filters={filters}
				onChange={updateFilters}
			/>
			<AttendanceList data={members} parts={PART_ORDER} />
		</div>
	);
}
export function AttendanceMember() {
	const { reset: resetQueries } = useQueryErrorResetBoundary();
	return (
		<ErrorBoundary
			onReset={resetQueries}
			fallback={({ reset }: ErrorBoundaryFallbackProps) => (
				<div className="h-dvh">
					<ErrorBox onReset={reset} />
				</div>
			)}
		>
			<Suspense
				fallback={
					<div className="h-dvh">
						<LoadingBox />
					</div>
				}
			>
				<AttendanceMemberContainer />
			</Suspense>
		</ErrorBoundary>
	);
}
