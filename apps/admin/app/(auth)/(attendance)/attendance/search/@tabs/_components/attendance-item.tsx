import { Badge } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { Profile } from '@/components/attendance/profile';

export const AttendanceItem = () => {
	return (
		<div className="flex justify-between py-3">
			<Profile size={40} name="김서현" teamNumber={1} part="DESIGN" />
			<AttendanceStatusLabel status="LATE" />
		</div>
	);
};

export const AttendanceMemberItem = () => {
	return (
		<div className="flex items-center justify-between py-3">
			<Profile size={40} name="김서현" teamNumber={1} part="DESIGN" />
			<Badge variant="AT_RISK">수료 위험</Badge>
		</div>
	);
};
