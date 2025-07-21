import type { AttendanceStatus } from '@dpm-core/api';
import { Calender, Clock, formatDotFullDate, formatTimeOnly } from '@dpm-core/shared';
import { Link } from 'next-view-transitions';
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
			className="flex w-full justify-between items-center px-3 py-4 border-b border-line-normal"
		>
			<div>
				<p className="mb-0.5 text-label-assistive text-caption1 font-medium">{week}주차 세션</p>
				<p className="mb-0.5 text-label-normal text-body1 font-semibold">{eventName}</p>
				<p className="flex gap-2 text-label-assistive text-caption1 font-medium">
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
