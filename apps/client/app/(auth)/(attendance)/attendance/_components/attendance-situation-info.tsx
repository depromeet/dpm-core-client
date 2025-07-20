'use client';

import { Avatar } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Suspense } from 'react';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import { getAttandanceMeOptions } from '@/remotes/queries/attendance';

const AttendanceContainer = () => {
	const {
		data: { data: attendanceInfo },
	} = useSuspenseQuery(getAttandanceMeOptions());

	return (
		<section className="px-4 mt-5 mb-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-3 items-center">
					<Avatar className="bg-background-strong size-15 p-1.5">
						<Image
							src={
								isExistPart(attendanceInfo.member.part)
									? cohort[attendanceInfo.member.part]
									: cohort.WEB
							}
							fill
							alt="profile"
						/>
					</Avatar>
					<div className="flex flex-col gap-0.5">
						<span className="text-body1 font-semibold">{attendanceInfo.member.name}</span>
						<p className="flex gap-3 text-label-assistive text-caption1 font-medium">
							<span>{attendanceInfo.member.teamNumber}팀</span>
							<span>{attendanceInfo.member.part}</span>
						</p>
					</div>
				</div>
				<span className="flex items-center bg-red-100 text-caption1 font-semibold text-red-500 px-[5px] py-[3px] rounded-sm">
					수료 위험
				</span>
			</div>
			<ul className="bg-background-subtle px-5 py-[18px] flex rounded-xl justify-between text-body2">
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':'] ">출석</span>
					<span className="font-semibold">{attendanceInfo.attendance.presentCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">지각</span>
					<span className="font-semibold">{attendanceInfo.attendance.lateCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">인정</span>
					<span className="font-semibold">{attendanceInfo.attendance.excusedAbsentCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">결석</span>
					<span className="font-semibold">{attendanceInfo.attendance.absentCount}회</span>
				</li>
			</ul>
		</section>
	);
};

export const AttendanceSituationInfo = ErrorBoundary.with(
	{
		fallback: (props) => {
			return <ErrorBox onReset={() => props.reset()} />;
		},
	},
	() => (
		<Suspense fallback={<LoadingBox />}>
			<AttendanceContainer />
		</Suspense>
	),
);
