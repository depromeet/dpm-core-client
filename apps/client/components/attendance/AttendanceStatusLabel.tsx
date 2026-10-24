import type { AbsenceReasonStatus, AttendanceStatus } from '@dpm-core/api';
import { ATTENDANCE_STATUS_MAP, cn } from '@dpm-core/shared';

interface AttendanceLabelProps extends React.ComponentProps<'span'> {
	status: AttendanceStatus;
	absenceReasonStatus?: AbsenceReasonStatus;
}

const AttendanceStatusLabel = ({ status, absenceReasonStatus, ...props }: AttendanceLabelProps) => {
	const { className, ...restProps } = props;
	const { icon, label } =
		absenceReasonStatus === 'PENDING'
			? { ...ATTENDANCE_STATUS_MAP.PENDING, label: '검토 대기' }
			: ATTENDANCE_STATUS_MAP[status];

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
