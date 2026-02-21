'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ArrowRight, Button, ChevronRight, fadeInOutVariatns, useIsMobile } from '@dpm-core/shared';

import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { Pressable } from '@/components/motion';
import { showAttendanceBanner, showAttendanceCodeBanner } from '@/lib/attendance/banner';
import { formatSessionWeekString } from '@/lib/session/format';
import { getCurrentWeekSessionQuery } from '@/remotes/queries/session';

const SessionBannerContainer = () => {
	const {
		data: { data: currentWeekSession },
	} = useSuspenseQuery(getCurrentWeekSessionQuery);

	if (!currentWeekSession) return null;

	if (
		!showAttendanceCodeBanner(currentWeekSession.date) &&
		!showAttendanceBanner(currentWeekSession.date)
	)
		return null;

	return (
		<motion.section
			variants={{
				...fadeInOutVariatns.variants,
				initial: { ...fadeInOutVariatns.variants.initial, y: -20 },
			}}
			className="mx-auto max-w-[1200px] md:mt-8 md:flex md:items-center md:justify-start md:gap-5 md:px-10"
		>
			{showAttendanceCodeBanner(currentWeekSession.date) && (
				<AttendanceCodeBanner
					week={currentWeekSession.week}
					sessionId={currentWeekSession.id}
					attendanceCode={currentWeekSession.attendanceCode}
				/>
			)}
			{showAttendanceBanner(currentWeekSession.date) && (
				<CurrentSessionBanner week={currentWeekSession.week} sessionId={currentWeekSession.id} />
			)}
		</motion.section>
	);
};

export const SessionBanner = () => {
	return (
		<ErrorBoundary
			fallback={(props) => {
				return (
					<div className="flex flex-col items-center justify-center">
						<p className="font-semibold text-body2">진행중인 세션 정보 조회에 실패했어요.</p>
						<button type="button" onClick={() => props.reset()}>
							다시 시도
						</button>
					</div>
				);
			}}
		>
			<Suspense>
				<SessionBannerContainer />
			</Suspense>
		</ErrorBoundary>
	);
};

interface AttendanceBannerProps {
	sessionId: number;
	week: number;
	attendanceCode: string;
}

const AttendanceCodeBanner = (props: AttendanceBannerProps) => {
	const { attendanceCode, week, sessionId } = props;

	return (
		<Pressable
			variant="none"
			className="flex items-center justify-between rounded-none bg-primary-normal px-4 py-3 md:h-[134px] md:flex-1 md:items-start md:rounded-[10px] md:p-5"
			asChild
		>
			<Link href={`/session/${sessionId}`} className="relative">
				<p className="flex font-medium text-caption1 text-white md:flex-col md:font-semibold">
					<span>{formatSessionWeekString(week)}</span>
					<span className="max-md:after:m-1 max-md:after:content-[':'] md:font-bold md:text-headline2">
						출석 코드
					</span>
					<strong className="md:font-bold md:text-headline2">{attendanceCode}</strong>
				</p>
				<div className="absolute right-5 bottom-5 rounded-full bg-blue-300 p-2.5 max-md:hidden">
					<ArrowRight />
				</div>
				<ChevronRight className="text-white md:hidden" />
			</Link>
		</Pressable>
	);
};

interface CurrentSessionBannerProps {
	week: number;
	sessionId: number;
}

const CurrentSessionBanner = (props: CurrentSessionBannerProps) => {
	const { week, sessionId } = props;

	const isMobile = useIsMobile();
	const router = useRouter();

	const handleGoToAttendance = (sessionId: number) => {
		if (isMobile) return;
		router.push(`/attendance/search/session/?week=${sessionId}`);
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			onClick={() => handleGoToAttendance(sessionId)}
			className="relative mx-4 mt-3 mb-8 block rounded-[10px] bg-background-inverse px-4 pt-5 pb-7.5 md:m-0 md:h-[134px] md:flex-1 md:cursor-pointer md:p-5"
		>
			<div>
				<p className="font-semibold text-caption1 text-label-assistive">
					{formatSessionWeekString(week)} 출석
				</p>
				<div className="flex justify-between">
					<div>
						<p className="font-bold text-headline2 text-white">
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
						className="mt-2.5 md:hidden"
					/>
				</div>
				<Button className="mt-5 w-full md:hidden" variant="primary" size="lg" asChild>
					<Link href={`/attendance/search/session/?week=${sessionId}`}>
						출석 현황 확인하기
						<ArrowRight />
					</Link>
				</Button>
			</div>
			<div className="absolute right-5 bottom-5 rounded-full bg-blue-400 p-2.5 max-md:hidden">
				<ArrowRight />
			</div>
		</div>
	);
};
