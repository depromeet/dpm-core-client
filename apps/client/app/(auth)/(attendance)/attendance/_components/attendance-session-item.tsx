import Link from 'next/link';
import type { AttendanceStatus } from '@dpm-core/api';
import { Calender, Clock, formatDotFullDate, formatTimeOnly } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';

interface SessionItemProps {
	id: number;
	week: number;
	eventName: string;
	date: string;
	attendanceStatus: AttendanceStatus;
}

export const SessionItem = (props: SessionItemProps) => {
	const { id, week, eventName, date, attendanceStatus } = props;

	return (
		<Link
			href={`/attendance/me/${id}`}
			className="flex w-full items-center justify-between border-line-normal border-b px-3 py-4"
		>
			<div>
				<p className="mb-0.5 font-medium text-caption1 text-label-assistive">{week}주차 세션</p>
				<p className="mb-0.5 font-semibold text-body1 text-label-normal">{eventName}</p>
				<p className="flex gap-2 font-medium text-caption1 text-label-assistive">
					<span className="flex items-center gap-0.5">
						<Calender />
						<time dateTime={date}>{formatDotFullDate(date)}</time>
					</span>
					<span className="flex items-center gap-0.5">
						<Clock />
						{formatTimeOnly(date)}
					</span>
				</p>
			</div>
			<AttendanceStatusLabel status={attendanceStatus} />
		</Link>
	);
};
