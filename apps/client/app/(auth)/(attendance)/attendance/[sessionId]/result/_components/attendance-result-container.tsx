'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CircleCheck, CircleMinus } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getAttendanceMeBySessionIdOptions } from '@/remotes/queries/attendance';

interface AttendanceResultProps {
	sessionId: number;
}

const PresentView = ({ attendedAt }: { attendedAt: string }) => (
	<>
		<section className="mt-30">
			<div className="flex flex-col items-center justify-center gap-8">
				<div className="inline-flex rounded-full bg-[#5E83FE33] p-2.5">
					<CircleCheck size={32} />
				</div>
				<h2 className="font-semibold text-title1">오늘도 출석 완료!</h2>
			</div>
		</section>
		<AttendanceTime attendedAt={attendedAt} />
	</>
);

const LateView = ({ attendedAt }: { attendedAt: string }) => (
	<>
		<section className="mt-30">
			<div className="flex flex-col items-center justify-center gap-8">
				<div className="inline-flex rounded-full bg-[#FEC15E4D] p-2.5">
					<CircleMinus size={32} />
				</div>
				<h2 className="font-semibold text-title1">앗 오늘은 지각이네요</h2>
			</div>
		</section>
		<AttendanceTime attendedAt={attendedAt} />
	</>
);

const AttendanceTime = ({ attendedAt }: { attendedAt: string }) => (
	<section className="mx-auto mt-4">
		<div className="flex gap-2 rounded-lg bg-background-strong px-5 py-3.5 text-body2">
			<span className="font-semibold text-label-assistive">출석 시간</span>
			<span className="font-medium text-label-subtle">
				{formatISOStringToFullDateString(attendedAt)}
			</span>
		</div>
	</section>
);

const AttendanceResultContainer = ({ sessionId }: AttendanceResultProps) => {
	const router = useRouter();

	const {
		data: {
			data: { attendance },
		},
	} = useSuspenseQuery(getAttendanceMeBySessionIdOptions({ sessionId }));

	useEffect(() => {
		if (!['PRESENT', 'LATE'].includes(attendance.status)) {
			router.replace(`/attendance/${sessionId}`);
		}
	}, [attendance.status, router, sessionId]);

	if (attendance.status === 'PRESENT') {
		return <PresentView attendedAt={attendance.attendedAt} />;
	}

	if (attendance.status === 'LATE') {
		return <LateView attendedAt={attendance.attendedAt} />;
	}

	return null;
};

export const AttendanceResult = (props: AttendanceResultProps) => {
	return (
		<ErrorBoundary
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceResultContainer {...props} />
			</Suspense>
		</ErrorBoundary>
	);
};
