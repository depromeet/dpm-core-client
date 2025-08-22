import type { AttendanceStatus } from '@dpm-core/api';
import { cn, ATTENDANCE_STATUS_MAP } from '@dpm-core/shared';

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
					'text-body2 font-semibold',
					status === 'PENDING' ? 'text-label-assistive' : 'text-label-subtle',
				)}
			>
				{label}
			</strong>
		</span>
	);
};

export default AttendanceStatusLabel;
