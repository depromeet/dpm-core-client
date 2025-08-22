import type { Attendance, AttendanceMember } from '@dpm-core/api';
import { Badge } from '@dpm-core/shared';
import { Profile } from '@/components/attendance/profile';
import { getAttendanceMemberStatusLabel } from '@/lib/attendance/status';

interface AttendanceMemberInfoProps {
	member: AttendanceMember;
	attendance?: Attendance;
}

export const AttendanceMemberInfo = (props: AttendanceMemberInfoProps) => {
	const { member, attendance } = props;

	return (
		<section className="px-4 mt-5 mb-4">
			<div className="flex justify-between items-center mb-4">
				<Profile size={60} name={member.name} part={member.part} teamNumber={member.teamNumber} />
				{member.attendanceStatus !== 'NORMAL' && (
					<Badge variant={member.attendanceStatus}>
						{getAttendanceMemberStatusLabel(member.attendanceStatus)}
					</Badge>
				)}
			</div>
			{attendance && (
				<ul className="bg-background-subtle px-5 py-[18px] flex rounded-xl justify-between text-body2">
					<li>
						<span className="mr-2 text-label-assistive font-medium">출석</span>
						<span className="font-semibold text-label-subtle">{attendance.presentCount ?? 0}</span>
					</li>
					<li>
						<span className="mr-2 text-label-assistive font-medium">결석</span>
						<span className="font-semibold text-label-subtle">{attendance.absentCount ?? 0}</span>
					</li>
					<li>
						<span className="mr-2 text-label-assistive font-medium">지각</span>
						<span className="font-semibold text-label-subtle">{attendance.lateCount ?? 0}</span>
					</li>
					<li>
						<span className="mr-2 text-label-assistive font-medium">인정</span>
						<span className="font-semibold text-label-subtle">{attendance.excusedAbsentCount ?? 0}</span>
					</li>
					<li>
						<span className="mr-2 text-label-assistive font-medium">조퇴</span>
						<span className="font-semibold text-label-subtle">{attendance.earlyLeaveCount ?? 0}</span>
					</li>
				</ul>
			)}
		</section>
	);
};
