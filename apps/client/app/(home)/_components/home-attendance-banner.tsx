'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CircleIcon } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type {
	AttendanceBySessionIdReponse,
	AttendanceStatus,
	CurrentWeekSessionResponse,
} from '@dpm-core/api';
import { ArrowRight, Button } from '@dpm-core/shared';

import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { formatISOStringToFullDateString } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { getAttendanceMeBySessionIdOptions } from '@/remotes/queries/attendance';

import { AttendanceCheckBottomSheet } from './attendance-check-bottom-sheet';

interface HomeCheckAttendanceBannerProps {
	attendanceSession: CurrentWeekSessionResponse;
	isAttendanceOpen: boolean;
}

export const HomeCheckAttendanceBanner = ({
	attendanceSession,
	isAttendanceOpen,
}: HomeCheckAttendanceBannerProps) => {
	const reduceMotion = useReducedMotion();
	const { data } = useQuery({
		...getAttendanceMeBySessionIdOptions({ sessionId: attendanceSession.id }),
		enabled: isAttendanceOpen,
	});
	const visible = isAttendanceOpen && data;
	const transition = { duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' as const };

	return (
		<AnimatePresence>
			{visible ? (
				<motion.div
					key="attendance-banner"
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: 'auto', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={transition}
					className="overflow-hidden"
				>
					<motion.div
						initial={{ y: reduceMotion ? 0 : -12 }}
						animate={{ y: 0 }}
						transition={transition}
						className="pb-5"
					>
						<div className="rounded-[10px] bg-background-inverse p-5">
							<HomeCheckAttendanceBannerContent
								attendanceSession={attendanceSession}
								attendanceMeBySessionId={data.data}
							/>
						</div>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};

const completedAttendanceCopy = {
	PRESENT: { title: '출석 완료 !', buttonLabel: '출석을 완료했어요' }, // 정상 출석
	EARLY_LEAVE: { title: '출석 완료 !', buttonLabel: '출석을 완료했어요' }, // 조퇴
	LATE: { title: '오늘은 지각이네요', buttonLabel: '출석을 완료했어요' }, // 지각
	ABSENT: { title: '결석 처리됐어요', buttonLabel: '출석을 마감했어요' }, // 결석
} satisfies Record<
	Exclude<AttendanceStatus, 'PENDING' | 'EXCUSED_ABSENT'>,
	{ title: string; buttonLabel: string }
>;

interface HomeCheckAttendanceBannerContentProps {
	attendanceSession: CurrentWeekSessionResponse;
	attendanceMeBySessionId: AttendanceBySessionIdReponse;
}

const HomeCheckAttendanceBannerContent = ({
	attendanceSession,
	attendanceMeBySessionId,
}: HomeCheckAttendanceBannerContentProps) => {
	const { status, attendedAt } = attendanceMeBySessionId.attendance;
	const { absentStart } = attendanceSession;

	// 출석체크 전
	if (status === 'PENDING') {
		return (
			<>
				<div className="flex justify-between">
					<div>
						<p className="mb-1 font-semibold text-caption1 text-label-assistive">
							{attendanceSession.week}주차
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
				<div className="flex flex-col items-center gap-3">
					<AttendanceCheckBottomSheet sessionId={attendanceSession.id}>
						<Button className="mt-5 w-full" variant="primary" size="lg">
							출석체크하기
							<ArrowRight />
						</Button>
					</AttendanceCheckBottomSheet>
					<Link
						href={`/attendance/me/${attendanceSession.id}/absence-reason`}
						className="font-medium text-body2 text-label-assistive"
					>
						오늘 참석이 어렵다면 &gt;
					</Link>
				</div>
			</>
		);
	}

	const isExcusedAbsent = status === 'EXCUSED_ABSENT';
	const { title, buttonLabel } = isExcusedAbsent
		? { title: '인정 결석', buttonLabel: null }
		: completedAttendanceCopy[status];
	const timeLabel = status === 'ABSENT' ? '출석 마감' : '출석 시간';
	const time = status === 'ABSENT' ? absentStart : attendedAt;

	return (
		<>
			<div className="flex justify-between">
				<div>
					<p className="mb-1 font-semibold text-caption1 text-label-assistive">
						{formatSessionWeekString(attendanceSession.week)} 출석
					</p>
					<p className="font-bold text-headline2 text-white">{title}</p>
					{isExcusedAbsent ? (
						<p className="mt-1 font-semibold text-caption1 text-label-assistive">
							결석 사유서를 제출했어요.
						</p>
					) : (
						<p className="mt-1 font-semibold text-caption1 text-label-assistive">
							{timeLabel} |{' '}
							<span className="font-normal">{formatISOStringToFullDateString(time)}</span>
						</p>
					)}
				</div>
				<Image
					src={Iconttendance3D}
					alt="출석체크 아이콘"
					width={80}
					height={80}
					className="mt-2.5"
				/>
			</div>
			{!isExcusedAbsent ? (
				<Button disabled className="mt-5 w-full" variant="primary" size="lg">
					<CircleIcon size={20} />
					{buttonLabel}
					<ArrowRight />
				</Button>
			) : null}
		</>
	);
};
