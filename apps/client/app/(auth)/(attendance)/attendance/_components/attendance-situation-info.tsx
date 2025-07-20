'use client';

import { attendance } from '@dpm-core/api';
import { Avatar } from '@dpm-core/shared';
import { useSuspenseQuery } from '@tanstack/react-query';

export const AttendanceSitutationInfo = () => {
	const {
		data: {
			data: { member, attendance: attendanceInfo },
		},
	} = useSuspenseQuery({
		queryKey: ['ATTENDANCE_QUERY_KEY', 'ME'],
		queryFn: () => attendance.getMe(),
	});

	return (
		<section className="px-4 mt-5 mb-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-3 items-center">
					<Avatar className="bg-background-strong size-15 p-1.5">
						{/* <Image src="." fill alt="profile" /> */}
					</Avatar>
					<div className="flex flex-col gap-0.5">
						<span className="text-body1 font-semibold">{member.name}</span>
						<p className="flex gap-3 text-label-assistive text-caption1 font-medium">
							<span>{member.teamNumber}팀</span>
							<span>{member.part}</span>
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
					<span className="font-semibold">{attendanceInfo.presentCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">지각</span>
					<span className="font-semibold">{attendanceInfo.lateCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">인정</span>
					<span className="font-semibold">{attendanceInfo.excusedAbsentCount}회</span>
				</li>
				<li>
					<span className="mr-2 text-label-assistive font-medium after:content-[':']">결석</span>
					<span className="font-semibold">{attendanceInfo.absentCount}회</span>
				</li>
			</ul>
		</section>
	);
};
