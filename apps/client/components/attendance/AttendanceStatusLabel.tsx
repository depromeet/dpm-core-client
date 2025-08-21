import type { AttendanceStatus } from '@dpm-core/api';
import { CircleCheck, CircleDot, CircleMinus, CircleX, cn } from '@dpm-core/shared';

const STATUS_MAP = {
	PRESENT: {
		icon: <CircleCheck color="#5E83FE" size={16} />,
		label: '출석',
	},
	ABSENT: {
		icon: <CircleX color="#FF7070" size={16} />,
		label: '결석',
	},
	LATE: {
		icon: <CircleMinus color="#FFC06E" size={16} />,
		label: '지각',
	},
	EXCUSED_ABSENT: {
		icon: <CircleMinus color="#3EA32C" size={16} />,
		label: '인정',
	},
	EARLY_LEAVE: {
		icon: <CircleMinus color="#FFC06E" size={16} />,
		label: '조퇴',
	},
	PENDING: {
		icon: <CircleDot color="#9CA3AF" size={16} />,
		label: '미출석',
	},
};

interface AttendanceLabelProps extends React.ComponentProps<'span'> {
	status: AttendanceStatus;
}

const AttendanceStatusLabel = ({ status, ...props }: AttendanceLabelProps) => {
	const { icon, label } = STATUS_MAP[status];

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
