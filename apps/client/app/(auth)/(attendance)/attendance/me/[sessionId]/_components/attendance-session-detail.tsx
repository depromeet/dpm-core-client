'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import type { AttendanceSession } from '@dpm-core/api';
import { Button } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToFullDateString } from '@/lib/date';
import {
	getAttendanceMeBySessionIdOptions,
	getMyAbsenceReasonOptions,
} from '@/remotes/queries/attendance';

function SessionInfoCard({ session }: { session: AttendanceSession }) {
	const rows = [
		{ label: '세션 주차', value: `${session.week}주차` },
		{ label: '세션명', value: session.eventName },
		{ label: '세션 날짜', value: formatISOStringToFullDateString(session.date) },
		{ label: '세션 장소', value: session.place },
	];

	return (
		<div className="flex flex-col gap-2">
			<p className="font-semibold text-body1 text-label-subtle">세션 정보</p>
			<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 text-body2">
				{rows.map(({ label, value }) => (
					<div key={label} className="flex gap-4">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">{label}</p>
						<p className="min-w-0 flex-1 font-medium text-label-subtle">{value}</p>
					</div>
				))}
			</div>
		</div>
	);
}

const AttendanceSessionDetailContainer = ({ sessionId }: { sessionId: number }) => {
	const [{ data: attendanceData }, { data: absenceReasonData }] = useSuspenseQueries({
		queries: [
			getAttendanceMeBySessionIdOptions({ sessionId }),
			getMyAbsenceReasonOptions({ sessionId }),
		],
	});

	const { session, attendance } = attendanceData.data;

	const canSubmitReason =
		attendance.status === 'PENDING' ||
		attendance.status === 'ABSENT' ||
		attendance.status === 'EXCUSED_ABSENT';

	return (
		<>
			<section className="mt-5">
				<article className="mb-5 px-4">
					<h3 className="mb-3 font-semibold text-body1 text-label-subtle">출석 정보</h3>
					<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 font-semibold text-body2">
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 상태</p>
							<AttendanceStatusLabel status={attendance.status} />
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 시간</p>
							<p className="font-medium text-label-subtle">
								{formatISOStringToFullDateString(attendance.attendedAt)}
							</p>
						</div>
					</div>
				</article>
				<article className="mt-5 mb-5 px-4">
					<SessionInfoCard session={session} />
				</article>
			</section>

			{canSubmitReason ? (
				<>
					{/* 하단 고정 버튼 영역만큼 콘텐츠 영역에 여백 확보 */}
					<div className="h-20" aria-hidden="true" />
					<div className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-lg bg-background-normal px-5 pt-3 pb-5">
						<Button variant="primary" size="lg" className="w-full" asChild>
							<Link href={`/attendance/me/${sessionId}/absence-reason`}>
								{absenceReasonData.data ? '결석 사유 수정하기' : '결석 사유 제출하기'}
							</Link>
						</Button>
					</div>
				</>
			) : null}
		</>
	);
};

export const AttendanceSessionDetail = ({ sessionId }: { sessionId: number }) => (
	<ErrorBoundary fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}>
		<Suspense fallback={<LoadingBox />}>
			<AttendanceSessionDetailContainer sessionId={sessionId} />
		</Suspense>
	</ErrorBoundary>
);
