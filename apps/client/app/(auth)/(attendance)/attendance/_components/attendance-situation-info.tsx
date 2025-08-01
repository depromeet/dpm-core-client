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
		<section className="px-4 mt-5 mb-4">
			<div className="flex justify-between items-center mb-4">
				<Profile size={60} name={member.name} part={member.part} teamNumber={member.teamNumber} />
				{member.attendanceStatus !== 'NORMAL' && (
					<Badge variant={member.attendanceStatus}>
						{attendanceStatusLabelMap[member.attendanceStatus]}
					</Badge>
				)}
			</div>
			<ul className="bg-background-subtle px-5 py-[18px] flex rounded-xl justify-between text-body2">
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':'] ">출석</span>
					<span className="font-semibold">{attendance.presentCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">지각</span>
					<span className="font-semibold">{attendance.lateCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">인정</span>
					<span className="font-semibold">{attendance.excusedAbsentCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">결석</span>
					<span className="font-semibold">{attendance.absentCount}회</span>
				</li>
			</ul>
		</section>
	);
};
