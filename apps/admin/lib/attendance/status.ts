import type { AttendanceStatus, MemberAttendanceStatus } from '@dpm-core/api';
import { ATTENDANCE_LABEL_MAP, ATTENDANCE_MEMBER_LABEL_MAP } from '@dpm-core/shared';

export const getAttendanceStatusLabel = (status: AttendanceStatus): string => {
	return ATTENDANCE_LABEL_MAP[status] ?? '-';
};

export const getAttendanceMemberStatusLabel = (status: MemberAttendanceStatus): string => {
	return ATTENDANCE_MEMBER_LABEL_MAP[status] ?? '-';
};
