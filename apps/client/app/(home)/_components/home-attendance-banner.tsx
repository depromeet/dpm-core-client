'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type {
	AbsenceReasonStatus,
	AttendanceStatus,
	CurrentWeekSessionResponse,
	MyAttendanceBySessionIdResponse,
} from '@dpm-core/api';
import { ArrowRight, Button, CheckIcon } from '@dpm-core/shared';

import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useFeedbackImpression } from '@/hooks/use-feedback-impression';
import { formatISOStringToFullDateString } from '@/lib/date';
import { formatSessionWeekString } from '@/lib/session/format';
import { useClarity } from '@/providers/client-clarity-adapter';
import {
	getAttendanceMeBySessionIdOptions,
	getMyAbsenceReasonOptions,
} from '@/remotes/queries/attendance';

import { AttendanceCheckBottomSheet } from './attendance-check-bottom-sheet';
import { HomeBannerStateReporter } from './home-banner-state-tracker';

interface HomeCheckAttendanceBannerProps {
	attendanceSession: CurrentWeekSessionResponse;
	isAttendanceOpen: boolean;
}

export const HomeCheckAttendanceBanner = ({
	attendanceSession,
	isAttendanceOpen,
}: HomeCheckAttendanceBannerProps) => {
	const reduceMotion = useReducedMotion();

	const { track } = useClarity();
	const hasViewedBanner = useRef(false);

	const now = dayjs();
	const isVisible =
		attendanceSession.canRecordAttendance &&
		(isAttendanceOpen ||
			(dayjs(attendanceSession.absentStart).isValid() &&
				now.isSame(dayjs(attendanceSession.date), 'day') &&
				!now.isBefore(dayjs(attendanceSession.absentStart))));
	const { data, isSuccess: isAttendanceResolved } = useQuery({
		...getAttendanceMeBySessionIdOptions({ sessionId: attendanceSession.id }),
		enabled: isVisible,
	});
	const absenceReasonQuery = useQuery({
		...getMyAbsenceReasonOptions({ sessionId: attendanceSession.id }),
		enabled: isVisible,
	});
	const absenceReasonStatus = absenceReasonQuery.data?.data?.status;
	const visible =
		isVisible && !absenceReasonQuery.isPending && (data || absenceReasonStatus === 'PENDING');
	const isBannerStateResolved =
		!isVisible || (isAttendanceResolved && absenceReasonQuery.isSuccess);
	const bannerState = visible ? 'active' : 'inactive';

	const handleBannerView = useCallback(() => {
		if (hasViewedBanner.current) return;
		hasViewedBanner.current = true;
		try {
			track(CLARITY_ACTION_ID.HOME.ATTENDANCE_BANNER_VIEWED);
		} catch {
			// 분석 이벤트 실패가 홈 화면에 영향을 주지 않도록 한다.
		}
	}, [track]);

	const bannerRef = useFeedbackImpression<HTMLDivElement>(Boolean(visible), handleBannerView);

	const transition = { duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' as const };

	return (
		<>
			{isBannerStateResolved ? <HomeBannerStateReporter state={bannerState} /> : null}
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
							<div
								ref={bannerRef}
								data-coachmark={
									isAttendanceOpen &&
									data?.data.attendance.status === 'PENDING' &&
									absenceReasonStatus !== 'PENDING'
										? 'attendance-check'
										: undefined
								}
								className="rounded-[10px] bg-background-inverse p-5"
							>
								<HomeCheckAttendanceBannerContent
									attendanceSession={attendanceSession}
									attendanceMeBySessionId={data?.data}
									absenceReasonStatus={absenceReasonStatus}
								/>
							</div>
						</motion.div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	);
};

const completedAttendanceCopy = {
	PRESENT: { title: '출석 완료 !', buttonLabel: '출석을 완료했어요' }, // 정상 출석
	LATE: { title: '오늘은 지각이에요', buttonLabel: '출석을 완료했어요' }, // 지각
	ABSENT: { title: '결석 처리됐어요', buttonLabel: '출석을 마감했어요' }, // 결석
} satisfies Record<
	Exclude<AttendanceStatus, 'PENDING' | 'EXCUSED_ABSENT'>,
	{ title: string; buttonLabel: string }
>;

interface HomeCheckAttendanceBannerContentProps {
	attendanceSession: CurrentWeekSessionResponse;
	attendanceMeBySessionId?: MyAttendanceBySessionIdResponse;
	absenceReasonStatus?: AbsenceReasonStatus;
}

const HomeCheckAttendanceBannerContent = ({
	attendanceSession,
	attendanceMeBySessionId,
	absenceReasonStatus,
}: HomeCheckAttendanceBannerContentProps) => {
	const { track } = useClarity();

	const attendanceStatus = attendanceMeBySessionId?.attendance.status ?? 'PENDING';
	const attendedAt = attendanceMeBySessionId?.attendance.attendedAt ?? null;
	const isReviewPending = absenceReasonStatus === 'PENDING';
	const { absentStart } = attendanceSession;
	const isPastAbsentStart = !dayjs().isBefore(dayjs(absentStart));
	const canCheckAttendance = isPastAbsentStart
		? attendanceMeBySessionId?.attendance.canRegisterLateParticipation
		: attendanceStatus === 'PENDING';

	// 출석체크 전
	if (canCheckAttendance) {
		return (
			<>
				<div className="flex justify-between">
					<div>
						<p className="mb-1 text-caption1 font-semibold text-label-assistive">
							{attendanceSession.week}주차
						</p>
						<p className="text-headline2 font-bold text-white">
							{isPastAbsentStart ? (
								completedAttendanceCopy.ABSENT.title
							) : (
								<>
									출석체크를
									<br />
									진행해 주세요.
								</>
							)}
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
						<Button
							className="mt-5 w-full"
							variant="primary"
							size="lg"
							onClick={() => {
								try {
									track(CLARITY_ACTION_ID.HOME.ATTENDANCE_BANNER_CLICKED);
								} catch {
									// 분석 이벤트 실패가 출석 코드 시트 열기를 막지 않도록 한다.
								}
							}}
						>
							출석체크하기
							<ArrowRight />
						</Button>
					</AttendanceCheckBottomSheet>
					<Link
						href={`/attendance/me/${attendanceSession.id}/absence-reason`}
						className="text-body2 font-medium text-label-assistive"
					>
						오늘 참석이 어렵다면 &gt;
					</Link>
				</div>
			</>
		);
	}

	const isExcusedAbsent = attendanceStatus === 'EXCUSED_ABSENT';

	const timeLabel = attendanceStatus === 'ABSENT' ? '출석 마감' : '출석 시간';
	const time = attendanceStatus === 'ABSENT' ? absentStart : attendedAt;

	const { title, buttonLabel } = (() => {
		if (isReviewPending) {
			return { title: '인정 결석 대기', buttonLabel: null };
		}
		if (isExcusedAbsent) {
			return { title: '인정 결석', buttonLabel: null };
		}
		return completedAttendanceCopy[attendanceStatus === 'PENDING' ? 'ABSENT' : attendanceStatus];
	})();

	return (
		<>
			<div className="flex justify-between">
				<div>
					<p className="mb-1 text-caption1 font-semibold text-label-assistive">
						{formatSessionWeekString(attendanceSession.week)} 출석
					</p>
					<p className="text-headline2 font-bold text-white">{title}</p>
					{isReviewPending || isExcusedAbsent ? (
						<p className="mt-1 text-caption1 font-semibold text-label-assistive">
							{isReviewPending ? '결석 사유서를 검토하고 있어요.' : '결석 사유서를 제출했어요.'}
						</p>
					) : (
						<p className="mt-1 text-caption1 font-semibold text-label-assistive">
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
			{!isReviewPending && !isExcusedAbsent ? (
				<Button disabled className="mt-5 w-full" variant="primary" size="lg">
					<CheckIcon size={16} />
					{buttonLabel}
				</Button>
			) : null}
		</>
	);
};
