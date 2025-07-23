import type { Part } from '../member';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED_ABSENT' | 'PENDING';
export type MemberAttendanceStatus = 'NORMAL' | 'AT_RISK' | 'IMPOSSIBLE';

export interface AttendanceSession {
	id: number;
	week: number;
	eventName: string;
	date: string;
	attendanceStatus: AttendanceStatus;
}

export interface AttendanceMember {
	id: number;
	name: string;
	teamNumber: number;
	part: Part;
	attendanceStatus: MemberAttendanceStatus;
}

export interface Attendance {
	presentCount: number;
	lateCount: number;
	excusedAbsentCount: number;
	absentCount: number;
}

export interface AttendanceReponse {
	member: AttendanceMember;
	attendance: Attendance;
	sessions: AttendanceSession[];
}

export interface AttendanceBySessionIdReponse {
	member: AttendanceMember;
	attendance: { status: AttendanceStatus; attendedAt: string };
	session: AttendanceSession;
}

export interface AttendanceCheckReponse {
	attendanceStatus: AttendanceStatus;
	attendedAt: string;
}

// 세션별 출석 조회 타입
export interface AttendanceBySessionReponse {
	members: {
		id: number;
		name: string;
		teamNumber: number;
		part: Part;
		attendanceStatus: AttendanceStatus;
	}[];
	hasNextPage: boolean;
	nextCursorId: number | null;
}

export interface AttendanceByMemberReponse {
	members: {
		id: number;
		name: string;
		teamNumber: number;
		part: Part;
		attendanceStatus: MemberAttendanceStatus;
	}[];
	hasNextPage: boolean;
	nextCursorId: number | null;
}
