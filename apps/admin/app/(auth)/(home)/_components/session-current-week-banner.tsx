'use client';

import { ArrowRight, Button, fadeInOutVariatns } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { showAttendanceBanner } from '@/lib/attendance/banner';
import { formatSessionWeekString } from '@/lib/session/format';
import { getCurrentWeekSessionQuery } from '@/remotes/queries/session';

const SessionCurrentWeekBannerContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getCurrentWeekSessionQuery);

	if (!currentWeekSession) {
		return null;
	}

	if (!showAttendanceBanner(currentWeekSession.date)) {
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
				<p className="mb- text-label-assistive text-caption1 font-semibold">
					{formatSessionWeekString(currentWeekSession.week)} 출석
				</p>
				<div className="flex justify-between">
					<div>
						<p className="text-headline2 text-white font-bold">
							멤버들의 출석 현황을
							<br />
							확인해 주세요.
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
				<Button className="mt-5 w-full" variant="primary" size="lg" asChild>
					<Link href={`/attendance/search/session/?week=${currentWeekSession.sessionId}`}>
						출석 현황 확인하기
						<ArrowRight />
					</Link>
				</Button>
			</div>
		</motion.div>
	);
};

const SessionCurrentWeekBanner = ErrorBoundary.with(
	{
		fallback: (props) => {
			return (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-body2 font-semibold">진행중인 세션 정보 조회에 실패했어요.</p>
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
