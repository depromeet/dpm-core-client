import type { AttendanceStatus } from '@dpm-core/api';
import { ATTENDANCE_STATUS_MAP, cn } from '@dpm-core/shared';

interface AttendanceLabelProps extends React.ComponentProps<'span'> {
	status: AttendanceStatus;
}

const AttendanceStatusLabel = ({ status, ...props }: AttendanceLabelProps) => {
	const { icon, label } = ATTENDANCE_STATUS_MAP[status];

	return (
		<span className="flex items-center space-x-1" {...props}>
			{icon}
			<strong
				className={cn(
					'font-semibold text-body2',
					status === 'PENDING' ? 'text-label-assistive' : 'text-label-subtle',
				)}
			>
				{label}
			</strong>
		</span>
	);
};

export default AttendanceStatusLabel;
