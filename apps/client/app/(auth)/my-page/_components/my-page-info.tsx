'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { motion } from 'motion/react';
import type { LoginMethod } from '@dpm-core/api';
import {
	AppleLogo,
	ATTENDANCE_MEMBER_LABEL_MAP,
	Badge,
	cn,
	fadeInOutVariatns,
	KakaoLogo,
} from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import { getAttendanceMeOptions } from '@/remotes/queries/attendance';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

import { MyPageBox } from './my-page-box';

function getSocialIcon(method: LoginMethod | undefined) {
	if (method === 'KAKAO') {
		return {
			icon: <KakaoLogo className="h-2.5 w-3" />,
			background: 'bg-[#FEE500]',
		};
	}
	if (method === 'APPLE') {
		return {
			icon: <AppleLogo className="h-3 w-2.5" />,
			background: 'bg-[#1F2937]',
		};
	}
	return null;
}

const MyPageInfoContent = () => {
	const [{ data: memberResponse }, { data: attendanceResponse }] = useSuspenseQueries({
		queries: [getMyMemberInfoQuery, getAttendanceMeOptions()],
	});

	const member = memberResponse.data;
	const part = isExistPart(member.part) ? member.part : 'ETC';
	const attendance = attendanceResponse.isError ? null : attendanceResponse.data;
	const attendanceStatus = attendance?.member.attendanceStatus;
	const counts = attendance
		? [
				{ label: '출석', value: attendance.attendance.presentCount },
				{ label: '지각', value: attendance.attendance.lateCount },
				{ label: '인정', value: attendance.attendance.excusedAbsentCount },
				{ label: '결석', value: attendance.attendance.absentCount },
			]
		: [];

	const socialIcon = getSocialIcon(member.loginMethod);

	return (
		<motion.div variants={fadeInOutVariatns.variants} className="flex flex-col gap-2">
			<MyPageBox className="flex flex-col gap-y-3">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-x-3">
						<div className="h-15 w-15 overflow-hidden rounded-full bg-background-normal">
							<Image
								src={cohort[part].icon}
								alt={`${cohort[part].label}_프로필_이미지`}
								width={120}
								height={120}
								priority
							/>
						</div>
						<div className="flex flex-col gap-1">
							<p className="font-semibold text-body1 text-label-normal">{member.name}</p>
							<div className="flex items-center gap-1.5">
								<p className="font-medium text-body2 text-label-assistive">{member.cohort}기</p>
								<div className="h-3.5 w-px bg-line-subtle" />
								<p className="font-medium text-body2 text-label-assistive">{member.teamNumber}팀</p>
								<div className="h-3.5 w-px bg-line-subtle" />
								<p className="font-medium text-body2 text-label-assistive">{cohort[part].label}</p>
							</div>
						</div>
					</div>

					{attendanceStatus && attendanceStatus !== 'NORMAL' ? (
						<Badge variant={attendanceStatus}>
							{ATTENDANCE_MEMBER_LABEL_MAP[attendanceStatus]}
						</Badge>
					) : null}
				</div>
				{attendance !== null ? (
					<div className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-5 py-4.5">
						{counts.map(({ label, value }) => (
							<div key={label} className="flex items-center gap-2">
								<p className="font-medium text-body2 text-label-assistive">{label}:</p>
								<p className="font-semibold text-body2 text-label-subtle">{value}회</p>
							</div>
						))}
					</div>
				) : null}
			</MyPageBox>
			<MyPageBox className="flex flex-col gap-2">
				<p className="font-semibold text-body2 text-label-assistive">계정 정보</p>
				<p className="flex gap-2 text-body2 text-label-subtle">
					{socialIcon != null ? (
						<span
							className={cn(
								'inline-grid aspect-square w-5 place-items-center rounded-full',
								socialIcon.background,
							)}
						>
							{socialIcon.icon}
						</span>
					) : null}
					{member.email}
				</p>
			</MyPageBox>
		</motion.div>
	);
};

const MyPageInfo = ErrorBoundary.with(
	{
		fallback: ({ reset }: ErrorBoundaryFallbackProps) => {
			return <ErrorBox onReset={reset} className="h-49 flex-none" />;
		},
	},
	() => (
		<Suspense fallback={<LoadingBox className="h-49 flex-none" />}>
			<MyPageInfoContent />
		</Suspense>
	),
);

export { MyPageInfo };
