import type { AttendanceStatus } from '@dpm-core/api';
import { ATTENDANCE_STATUS_MAP, cn } from '@dpm-core/shared';

interface AttendanceLabelProps extends React.ComponentProps<'span'> {
	status: AttendanceStatus;
}

const AttendanceStatusLabel = ({ status, ...props }: AttendanceLabelProps) => {
	const { className, ...restProps } = props;
	const { icon, label } = ATTENDANCE_STATUS_MAP[status];

	return (
		<span
			className={cn('flex items-center gap-1 font-semibold text-body2', className)}
			{...restProps}
		>
			{icon}
			<span>{label}</span>
		</span>
	);
};

export default AttendanceStatusLabel;
