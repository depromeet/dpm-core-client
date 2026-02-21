'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { session } from '@dpm-core/api';
import { ArrowRight, fadeInOutVariatns, pressInOutVariatns } from '@dpm-core/shared';

import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { MotionButton } from '@/components/motion';
import { showAttendanceBanner } from '@/lib/attendance/banner';
import { formatSessionWeekString } from '@/lib/session/format';

const SessionCurrentWeekBannerContainer = () => {
	const { data: currentWeekSession } = useSuspenseQuery({
		queryKey: ['session-current-week', 'session-attendance-time'],
		queryFn: async () => {
			const { data: currentWeekSession } = await session.getCurrentWeekSession();
			if (!currentWeekSession) return null;
			const { data: attendanceTime } = await session.getSessionAttendanceTime(
				currentWeekSession.id,
			);
			return {
				...currentWeekSession,
				...attendanceTime,
			};
		},
		gcTime: 0,
	});

	if (!currentWeekSession) {
		return null;
	}

	if (!showAttendanceBanner(currentWeekSession.attendanceStartTime)) {
		return null;
	}

	return (
		<motion.div
			variants={{
				...fadeInOutVariatns.variants,
				initial: { ...fadeInOutVariatns.variants.initial, y: -20 },
			}}
			className="px-4 pt-5 pb-[30px]"
		>
			<div className="rounded-[10px] bg-background-inverse p-5">
				<div className="flex justify-between">
					<div>
						<p className="mb-1 font-semibold text-caption1 text-label-assistive">
							{`${formatSessionWeekString(currentWeekSession.week)} 출석`}
						</p>
						<p className="font-bold text-headline2 text-white">
							출석체크를
							<br />
							진행해 주세요.
						</p>
					</div>
					<Image
						src={Iconttendance3D}
						alt="출석체크 아이콘"
						width={80}
						height={80}
						className="mt-2.5"
					/>
				</div>
				<MotionButton
					{...pressInOutVariatns}
					className="mt-5 w-full"
					variant="primary"
					size="lg"
					asChild
				>
					<Link href={`/attendance/${currentWeekSession.id}`}>
						출석체크하기
						<ArrowRight />
					</Link>
				</MotionButton>
			</div>
		</motion.div>
	);
};

const SessionCurrentWeekBanner = ErrorBoundary.with(
	{
		fallback: ({ reset }: ErrorBoundaryFallbackProps<Error>) => {
			return (
				<div className="flex h-full flex-col items-center justify-center">
					<p className="font-semibold text-body2">세선 정보 조회에 실패했어요.</p>
					<button type="button" onClick={reset}>
						다시 시도
					</button>
				</div>
			);
		},
	},
	() => (
		<Suspense>
			<SessionCurrentWeekBannerContainer />
		</Suspense>
	),
);

export { SessionCurrentWeekBanner };
