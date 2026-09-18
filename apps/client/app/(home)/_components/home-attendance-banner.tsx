'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { CircleIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type {
	AttendanceBySessionIdReponse,
	AttendanceStatus,
	CurrentWeekSessionResponse,
} from '@dpm-core/api';
import { ArrowRight, Button, fadeInOutVariatns } from '@dpm-core/shared';

import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { showAttendanceBanner } from '@/lib/attendance/banner';
import { formatISOStringToFullDateString } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { getAttendanceMeBySessionIdOptions } from '@/remotes/queries/attendance';
import { getSessionCurrentOptions } from '@/remotes/queries/session';

import { AttendanceCheckBottomSheet } from './attendance-check-bottom-sheet';

const completedAttendanceCopy = {
	PRESENT: { title: '출석 완료 !', buttonLabel: '출석을 완료했어요' }, // 정상 출석
	EARLY_LEAVE: { title: '출석 완료 !', buttonLabel: '출석을 완료했어요' }, // 조퇴
	LATE: { title: '오늘은 지각이네요', buttonLabel: '출석을 완료했어요' }, // 지각
	ABSENT: { title: '결석 처리됐어요', buttonLabel: '출석을 마감했어요' }, // 결석
} satisfies Record<
	Exclude<AttendanceStatus, 'PENDING' | 'EXCUSED_ABSENT'>,
	{ title: string; buttonLabel: string }
>;

const HomeCheckAttendanceBannerContent = ({
	attendanceSession,
	attendanceMeBySessionId,
}: {
	attendanceSession: CurrentWeekSessionResponse;
	attendanceMeBySessionId: AttendanceBySessionIdReponse;
}) => {
	const { status, attendedAt } = attendanceMeBySessionId.attendance;
	const { absentStart } = attendanceSession;

	// 출석체크 전
	if (status === 'PENDING') {
		return (
			<>
				<div className="flex justify-between">
					<div>
						<p className="mb-1 font-semibold text-caption1 text-label-assistive">
							{`${formatSessionWeekString(attendanceSession.week)} 출석`}
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
				<AttendanceCheckBottomSheet sessionId={attendanceSession?.id ?? 0}>
					<Button className="mt-5 w-full" variant="primary" size="lg">
						출석체크하기
						<ArrowRight />
					</Button>
				</AttendanceCheckBottomSheet>
			</>
		);
	}

	// 인정 결석
	if (status === 'EXCUSED_ABSENT') {
		return null;
	}

	const { title, buttonLabel } = completedAttendanceCopy[status];
	const timeLabel = status === 'ABSENT' ? '출석 마감' : '출석 시간';
	const time = status === 'ABSENT' ? absentStart : attendedAt;

	return (
		<>
			<div className="flex justify-between">
				<div>
					<p className="mb-1 font-semibold text-caption1 text-label-assistive">
						{`${formatSessionWeekString(attendanceSession.week)} 출석`}
					</p>
					<p className="font-bold text-headline2 text-white">{title}</p>
					<p className="mt-1 font-semibold text-caption1">
						{timeLabel} |{' '}
						<span className="font-normal">{formatISOStringToFullDateString(time)}</span>
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
			<Button disabled className="mt-5 w-full" variant="primary" size="lg">
				<CircleIcon size={20} />
				{buttonLabel}
				<ArrowRight />
			</Button>
		</>
	);
};

const HomeCheckAttendanceBannerContainer = () => {
	const {
		data: { data: attendanceSession },
	} = useSuspenseQuery(getSessionCurrentOptions());

	const shouldShowAttendanceBanner = attendanceSession
		? showAttendanceBanner(
				attendanceSession.attendanceStart,
				attendanceSession.lateStart,
				attendanceSession.absentStart,
			)
		: false;

	const { data: attendanceMeBySessionId, isError: isAttendanceMeBySessionIdError } = useQuery({
		...getAttendanceMeBySessionIdOptions({ sessionId: attendanceSession?.id ?? 0 }),
		enabled: attendanceSession?.id !== undefined && shouldShowAttendanceBanner,
	});

	const hideAttendanceBanner =
		!attendanceSession ||
		!shouldShowAttendanceBanner ||
		!attendanceMeBySessionId ||
		attendanceMeBySessionId.data.attendance.status === 'EXCUSED_ABSENT' ||
		isAttendanceMeBySessionIdError;

	if (hideAttendanceBanner) {
		return null;
	}

	return (
		<motion.div
			variants={{
				...fadeInOutVariatns.variants,
				initial: { ...fadeInOutVariatns.variants.initial, y: -20 },
			}}
			className="px-4 pt-5 pb-7.5"
		>
			<div className="rounded-[10px] bg-background-inverse p-5">
				<HomeCheckAttendanceBannerContent
					attendanceSession={attendanceSession}
					attendanceMeBySessionId={attendanceMeBySessionId.data}
				/>
			</div>
		</motion.div>
	);
};

// 배너는 부가 요소이므로 sessions/next 실패/로딩 시 조용히 숨긴다 (홈 전체가 깨지지 않도록)
export const HomeCheckAttendanceBanner = ErrorBoundary.with({ fallback: () => null }, () => (
	<Suspense fallback={null}>
		<HomeCheckAttendanceBannerContainer />
	</Suspense>
));
