import type { AttendanceStatus, MemberAttendanceStatus } from '@dpm-core/api';
import { CircleCheck, CircleX, CircleMinus, CircleDot } from '../components/icons';

export const ONE_MINUTE = 1000 * 60;
export const ATTENDANCE_GAP_DURATION = ONE_MINUTE * 15; // 15 minutes
export const ATTENDANCE_LATE_DURATION = ONE_MINUTE * 15; // 15 minutes

export const ATTENDANCE_LABEL_MAP: Record<AttendanceStatus, string> = {
	PRESENT: '출석',
	ABSENT: '결석',
	LATE: '지각',
	EXCUSED_ABSENT: '인정',
	PENDING: '미출석',
	EARLY_LEAVE: '조퇴',
};

export const ATTENDANCE_MEMBER_LABEL_MAP: Record<MemberAttendanceStatus, string> = {
	NORMAL: '수료 가능',
	AT_RISK: '수료 위험',
	IMPOSSIBLE: '수료 불가',
};

export const ATTENDANCE_STATUS_OPTIONS = [
	{ label: '출석', value: 'PRESENT' as const },
	{ label: '결석', value: 'ABSENT' as const },
	{ label: '지각', value: 'LATE' as const },
	{ label: '인정', value: 'EXCUSED_ABSENT' as const },
	{ label: '조퇴', value: 'EARLY_LEAVE' as const },
];

export const ATTENDANCE_STATUS_MAP = {
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
} as const;
