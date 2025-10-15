'use client';

import type { AttendanceReponse } from '@dpm-core/api';
import { Badge } from '@dpm-core/shared';

import { Profile } from '@/components/attendance/profile';

interface AttendanceMeInfoProps {
	member: AttendanceReponse['member'];
	attendance: AttendanceReponse['attendance'];
}

const attendanceStatusLabelMap = {
	NORMAL: '수료 가능',
	AT_RISK: '수료 위험',
	IMPOSSIBLE: '수료 불가',
};

export const AttendanceMeInfo = (props: AttendanceMeInfoProps) => {
	const { member, attendance } = props;

	return (
		<section className="mt-5 mb-4 px-4">
			<div className="mb-4 flex items-center justify-between">
				<Profile size={60} name={member.name} part={member.part} teamNumber={member.teamNumber} />
				{member.attendanceStatus !== 'NORMAL' && (
					<Badge variant={member.attendanceStatus}>
						{attendanceStatusLabelMap[member.attendanceStatus]}
					</Badge>
				)}
			</div>
			<ul className="flex justify-between rounded-xl bg-background-subtle px-5 py-[18px] text-body2">
				<li>
					<span className="mr-1 font-medium text-label-assistive">출석</span>
					<span className="font-semibold text-label-subtle">{attendance.presentCount ?? 0}</span>
				</li>
				<li>
					<span className="mr-1 font-medium text-label-assistive">결석</span>
					<span className="font-semibold text-label-subtle">{attendance.absentCount ?? 0}</span>
				</li>
				<li>
					<span className="mr-1 font-medium text-label-assistive">지각</span>
					<span className="font-semibold text-label-subtle">{attendance.lateCount ?? 0}</span>
				</li>
				<li>
					<span className="mr-1 font-medium text-label-assistive">인정</span>
					<span className="font-semibold text-label-subtle">
						{attendance.excusedAbsentCount ?? 0}
					</span>
				</li>
				<li>
					<span className="mr-1 font-medium text-label-assistive">조퇴</span>
					<span className="font-semibold text-label-subtle">{attendance.earlyLeaveCount ?? 0}</span>
				</li>
			</ul>
		</section>
	);
};
