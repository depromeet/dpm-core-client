'use client';

import { Suspense, useState } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import {
	useIsMutating,
	useQueryErrorResetBoundary,
	useSuspenseQueries,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { AnimatePresence } from 'motion/react';
import type { SessionWeek } from '@dpm-core/api';
import {
	Button,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	cn,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	formatDateOnly,
	formatKoreanDate,
	formatTimeOnly,
} from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { getAttendanceBySessionOptions } from '@/remotes/queries/attendance';
import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';
import { getMemberPartsQuery } from '@/remotes/queries/member';
import { getSessionWeeks } from '@/remotes/queries/session';

import { AttendanceSelectionBar, AttendanceSessionFilters } from '.';
import AttendanceList from './attendance-list';

const SESSION_STATUS_LABEL = {
	NOT_STARTED: '출석 시작 전',
	IN_PROGRESS: '출석 중',
	CLOSED: '출석 마감',
};

interface SessionRosterProps {
	session: SessionWeek;
	sessions: SessionWeek[];
}

function SessionRoster({ session, sessions }: SessionRosterProps) {
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	const [rosterQuery, teamsQuery, partsQuery] = useSuspenseQueries({
		queries: [
			getAttendanceBySessionOptions({ sessionId: session.id }),
			getCurrentCohortTeamsQuery,
			getMemberPartsQuery,
		],
	});
	const roster = rosterQuery.data.data;
	const teams = teamsQuery.data;
	const parts = partsQuery.data;

	const isBulkSaving = useIsMutating({ mutationKey: ['ATTENDANCE', 'bulk', session.id] }) > 0;

	const params = useCustomSearchParams();
	const filters = params.getAll();
	const selectedTeams = filters.teams?.split(',') ?? [];
	const selectedParts = filters.parts?.split(',') ?? [];
	const statusMembers = roster.members.filter(
		(member) =>
			(!filters.name || member.name.includes(filters.name.trim())) &&
			(!selectedTeams.length ||
				selectedTeams.includes(
					member.teamNumber === null ? 'UNASSIGNED' : String(member.teamNumber),
				)) &&
			(!selectedParts.length || selectedParts.includes(member.part ?? 'UNASSIGNED')) &&
			(filters.myTeam !== 'true' ||
				(roster.myTeamNumber !== null && member.teamNumber === roster.myTeamNumber)),
	);
	const members = statusMembers.filter(
		(member) => !filters.status || member.attendanceStatus === filters.status,
	);
	const visibleSelectedIds = selectedIds.filter((id) => members.some((member) => member.id === id));
	const allSelected = members.length > 0 && visibleSelectedIds.length === members.length;
	const sessionIndex = sessions.findIndex((item) => item.id === session.id);

	const updateFilters = (values: Record<string, string>) => {
		setSelectedIds([]);
		params.update(values, 'REPLACE');
	};
	const selectSession = (id: string) => params.update({ week: id }, 'REPLACE');

	return (
		<div className="relative flex h-dvh min-h-0 flex-col">
			<fieldset disabled={isBulkSaving} className="contents">
				<div className="z-20 shrink-0 bg-background-normal">
					<header className="px-10 py-6 shadow-[inset_0_-1px_0_0_var(--color-line-normal)]">
						<div className="flex items-center justify-between gap-4">
							<div className="flex min-w-0 flex-wrap items-center gap-3">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="none"
											size="none"
											className="max-w-full gap-3 font-bold text-headline1 tracking-[-0.48px]"
										>
											<span className="truncate">
												{session.week}주차 | {session.eventName}
											</span>
											<ChevronDown className="size-5 shrink-0 text-label-assistive" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="max-h-59 w-70 space-y-2 rounded-lg border-0 bg-background-normal p-3 text-label-subtle shadow-none ring-1 ring-line-subtle ring-inset"
									>
										{sessions.map((item) => (
											<DropdownMenuItem
												key={item.id}
												onSelect={() => selectSession(String(item.id))}
												className={cn(
													'h-9 justify-between gap-2 py-2 font-medium text-body2 focus:bg-background-strong',
													item.id === session.id && 'bg-background-strong',
												)}
											>
												<span className="min-w-0 truncate">
													{item.week}주차 | {item.eventName}
												</span>
												{item.id === session.id ? (
													<span className="shrink-0 text-caption1 text-label-assistive">
														선택됨
													</span>
												) : null}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<span className="shrink-0 rounded bg-primary-extralight px-2 py-1 font-medium text-caption1 text-primary-normal">
									{SESSION_STATUS_LABEL[session.attendanceStatus]}
								</span>
							</div>
							<div className="flex shrink-0 gap-2">
								<Button
									variant="text"
									size="sm"
									title="이전 세션"
									disabled={sessionIndex === 0}
									onClick={() => selectSession(String(sessions[sessionIndex - 1].id))}
								>
									<ChevronLeft className="size-5" />
								</Button>
								<Button
									variant="text"
									size="sm"
									title="다음 세션"
									disabled={sessionIndex === sessions.length - 1}
									onClick={() => selectSession(String(sessions[sessionIndex + 1].id))}
								>
									<ChevronRight className="size-5" />
								</Button>
							</div>
						</div>
						<div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-medium text-body1 text-label-subtle">
							<p>
								<span className="mr-2 text-label-assistive">시간</span>
								{formatKoreanDate(session.date)} {formatTimeOnly(session.date)}
							</p>
							<p>
								<span className="mr-2 text-label-assistive">장소</span>
								{session.isOnline ? '온라인' : session.place}
							</p>
							<p>
								<span className="mr-2 text-label-assistive">인원 수</span>
								{roster.totalElements}명
							</p>
						</div>
					</header>
					<AttendanceSessionFilters
						members={roster.members}
						statusMembers={statusMembers}
						teams={teams}
						parts={parts}
						myTeamNumber={roster.myTeamNumber}
						filters={filters}
						onChange={updateFilters}
					/>
				</div>
				<AttendanceList
					data={members}
					sessionId={session.id}
					selectedIds={visibleSelectedIds}
					onToggleItem={(id) =>
						setSelectedIds((ids) =>
							ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
						)
					}
					onToggleAll={() => setSelectedIds(allSelected ? [] : members.map((member) => member.id))}
					isAllSelected={allSelected}
				/>
			</fieldset>
			<AnimatePresence>
				{visibleSelectedIds.length > 0 ? (
					<AttendanceSelectionBar
						sessionId={session.id}
						selectedIds={visibleSelectedIds}
						onClear={() => setSelectedIds([])}
					/>
				) : null}
			</AnimatePresence>
		</div>
	);
}

function AttendanceSessionContainer() {
	const {
		data: {
			data: { sessions },
		},
	} = useSuspenseQuery(getSessionWeeks());

	const params = useCustomSearchParams();
	const today = new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date());
	const session =
		sessions.find((item) => String(item.id) === params.get('week')) ??
		sessions.find((item) => formatDateOnly(item.date) >= today) ??
		sessions.at(-1);

	if (!session) return <EmptyView message="현재 조회된 세션 정보가 없습니다" />;

	return <SessionRoster key={session.id} session={session} sessions={sessions} />;
}

export const AttendanceSession = () => {
	const { reset } = useQueryErrorResetBoundary();

	return (
		<ErrorBoundary
			onReset={reset}
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceSessionContainer />
			</Suspense>
		</ErrorBoundary>
	);
};
