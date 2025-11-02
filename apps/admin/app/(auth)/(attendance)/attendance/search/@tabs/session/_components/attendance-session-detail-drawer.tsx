'use client';

import {
	Button,
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	XCircle,
} from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { Profile } from '@/components/attendance/profile';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToFullDateString } from '@/lib/date';
import { getAttendanceBySessionDetailOptions } from '@/remotes/queries/attendance';

import { AttendanceModifyStatus } from '../../../../[memberId]/[sessionId]/_components/attendance-modify-status';

interface AttendanceSessionDetailDrawerProps {
	memberId: number;
	sessionId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const _AttendanceSessionDetailContent = ({
	memberId,
	sessionId,
}: {
	memberId: number;
	sessionId: number;
}) => {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceBySessionDetailOptions({ memberId, sessionId }));

	return (
		<>
			<SheetHeader className="flex-row items-center justify-between border-gray-200 border-b px-6 py-4">
				<SheetTitle className="font-semibold text-headline2 text-label-normal">
					출석 상세
				</SheetTitle>
				<SheetClose asChild>
					<Button variant="none" size="none" className="size-6">
						<XCircle className="size-6 text-icon-normal" />
					</Button>
				</SheetClose>
			</SheetHeader>

			<div className="flex-1 overflow-y-auto px-6 py-6">
				{/* 프로필 섹션 */}
				<section className="mb-6">
					<div className="flex items-start justify-between">
						<Profile
							size={60}
							name={data?.member.name}
							part={data?.member.part}
							teamNumber={data?.member.teamNumber}
						/>
						<Button
							variant="none"
							size="none"
							className="font-medium text-body2 text-primary-normal"
						>
							수정
						</Button>
					</div>
				</section>

				{/* 출석 정보 */}
				<section className="mb-6">
					<h3 className="mb-3 font-semibold text-body1 text-label-normal">출석 정보</h3>
					<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-4">
						<div className="flex items-center gap-4">
							<p className="w-20 font-medium text-body2 text-label-assistive">출석 상태</p>
							<AttendanceStatusLabel status={data?.attendance.status} />
						</div>
						<div className="flex items-center gap-4">
							<p className="w-20 font-medium text-body2 text-label-assistive">출석 시간</p>
							<p className="font-medium text-body2 text-label-normal">
								{formatISOStringToFullDateString(data?.attendance.attendedAt)}
							</p>
						</div>
					</div>
				</section>

				{/* 세션 정보 */}
				<section>
					<h3 className="mb-3 font-semibold text-body1 text-label-normal">세션 정보</h3>
					<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-4">
						<div className="flex items-center gap-4">
							<p className="w-20 font-medium text-body2 text-label-assistive">세션 주차</p>
							<p className="font-medium text-body2 text-label-normal">{data?.session.week}주차</p>
						</div>
						<div className="flex items-center gap-4">
							<p className="w-20 font-medium text-body2 text-label-assistive">세션명</p>
							<p className="font-medium text-body2 text-label-normal">{data?.session.eventName}</p>
						</div>
						<div className="flex items-center gap-4">
							<p className="w-20 font-medium text-body2 text-label-assistive">세션 날짜</p>
							<p className="font-medium text-body2 text-label-normal">
								{formatISOStringToFullDateString(data?.session.date)}
							</p>
						</div>
					</div>
				</section>
			</div>

			{/* 수정하기 버튼 */}
			<div className="border-gray-200 border-t p-6">
				<AttendanceModifyStatus
					sessionId={sessionId}
					member={data?.member}
					attendanceStatus={data.attendance.status}
				/>
			</div>
		</>
	);
};

export const AttendanceSessionDetailDrawer = ({
	memberId,
	sessionId,
	open,
	onOpenChange,
}: AttendanceSessionDetailDrawerProps) => {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full p-0 sm:max-w-[480px]">
				<ErrorBoundary fallback={(props) => <ErrorBox onReset={() => props.reset()} />}>
					<Suspense fallback={<LoadingBox />}>
						<_AttendanceSessionDetailContent memberId={memberId} sessionId={sessionId} />
					</Suspense>
				</ErrorBoundary>
			</SheetContent>
		</Sheet>
	);
};
