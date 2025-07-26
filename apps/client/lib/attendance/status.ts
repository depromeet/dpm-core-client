import type { AttendanceStatus, MemberAttendanceStatus } from '@dpm-core/api';

export const ATTENDANCE_LABEL_MAP: Record<AttendanceStatus, string> = {
	PRESENT: '출석',
	ABSENT: '결석',
	LATE: '지각',
	EXCUSED_ABSENT: '인정',
	PENDING: '미출석',
};

export const ATTENDANCE_MEMBER_LABEL_MAP: Record<MemberAttendanceStatus, string> = {
	NORMAL: '수료 가능',
	AT_RISK: '수료 위험',
	IMPOSSIBLE: '수료 불가',
};

export const getAttendanceStatusLabelLabel = (status: AttendanceStatus): string => {
	return ATTENDANCE_LABEL_MAP[status] ?? '-';
};

export const getAttendanceMemberStatusLabelLabel = (status: MemberAttendanceStatus): string => {
	return ATTENDANCE_MEMBER_LABEL_MAP[status] ?? '-';
};
