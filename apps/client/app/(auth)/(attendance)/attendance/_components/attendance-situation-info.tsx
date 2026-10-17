import { Fragment } from 'react';
import type { MyAttendanceResponse } from '@dpm-core/api';
import { Badge, cn, Divider } from '@dpm-core/shared';

interface AttendanceMeInfoProps {
	member: MyAttendanceResponse['member'];
	attendance: MyAttendanceResponse['attendance'];
}

const attendanceStatusLabelMap = {
	NORMAL: '수료 가능',
	AT_RISK: '수료 위험',
	IMPOSSIBLE: '수료 불가',
};

export const AttendanceMeInfo = (props: AttendanceMeInfoProps) => {
	const { member, attendance } = props;

	const attendanceList = [
		{
			status: '출석',
			value: attendance.presentCount,
			textColor: 'text-primary-normal',
		},

		{
			status: '지각',
			value: attendance.lateCount,
			textColor: 'text-label-assistive',
		},
		{
			status: '인정',
			value: attendance.excusedAbsentCount,
			textColor: 'text-red-400',
		},
		{
			status: '결석',
			value: attendance.absentCount,
			textColor: 'text-label-subtle',
		},
	];

	return (
		<section className="mt-5 mb-4 px-4">
			<div className="mb-4 flex items-center gap-1.5">
				<p className="font-semibold text-body1 text-label-normal">{member.name}</p>
				{member.attendanceStatus !== 'NORMAL' && (
					<Badge variant={member.attendanceStatus}>
						{attendanceStatusLabelMap[member.attendanceStatus]}
					</Badge>
				)}
			</div>
			<ul className="flex justify-between gap-2 rounded-xl bg-background-subtle px-3 py-2 font-medium text-body2 text-label-assistive">
				{attendanceList.map((attendance) => (
					<Fragment key={attendance.status}>
						<li className="flex flex-1 flex-col items-center gap-1 py-2">
							<p>{attendance.status}</p>
							<p className={cn('font-semibold', attendance.textColor)}>{attendance.value ?? 0}</p>
						</li>
						<Divider className="h-12 w-px shrink-0 self-center bg-line-normal last:hidden" />
					</Fragment>
				))}
			</ul>
		</section>
	);
};
