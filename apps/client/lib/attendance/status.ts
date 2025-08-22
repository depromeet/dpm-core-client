import type { AttendanceStatus, MemberAttendanceStatus } from '@dpm-core/api';
import { ATTENDANCE_LABEL_MAP, ATTENDANCE_MEMBER_LABEL_MAP } from '@dpm-core/shared';

export const getAttendanceStatusLabelLabel = (status: AttendanceStatus): string => {
	return ATTENDANCE_LABEL_MAP[status] ?? '-';
};

export const getAttendanceMemberStatusLabelLabel = (status: MemberAttendanceStatus): string => {
	return ATTENDANCE_MEMBER_LABEL_MAP[status] ?? '-';
};
