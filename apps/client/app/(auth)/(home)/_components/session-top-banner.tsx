'use client';

import { session } from '@dpm-core/api';
import { ArrowRight, fadeInOutVariatns, pressInOutVariatns } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
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
				currentWeekSession.sessionId,
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
			className="pt-5 px-4 pb-[30px]"
		>
			<div className="bg-background-inverse rounded-[10px] p-5">
				<div className="flex justify-between">
					<div>
						<p className="text-caption1 font-semibold text-label-assistive mb-1">
							{`${formatSessionWeekString(currentWeekSession.week)} 출석`}
						</p>
						<p className="text-headline2 text-white font-bold">
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
					<Link href={`/attendance/${currentWeekSession.sessionId}`}>
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
		fallback: (props) => {
			return (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-body2 font-semibold">세선 정보 조회에 실패했어요.</p>
					<button type="button" onClick={() => props.reset()}>
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
