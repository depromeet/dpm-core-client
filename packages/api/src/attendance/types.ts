import type { Part } from '../member';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED_ABSENT';
export type MemberAttendanceStatus = 'NORMAL' | 'AT_RISK' | 'IMPOSSIBLE';

export interface AttendanceSession {
	id: number;
	week: number;
	eventName: string;
	date: string;
	attendanceStatus: AttendanceStatus;
}

interface Member {
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
	member: Member;
	attendance: Attendance;
	sessions: AttendanceSession[];
}

export interface AttendanceBySessionIdReponse {
	member: Member;
	attendance: { status: AttendanceStatus; attendedAt: string };
	session: AttendanceSession;
}
