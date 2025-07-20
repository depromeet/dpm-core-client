export type AttendanceStatus = 'PENDING' | 'PRESENT' | 'LATE' | 'ABSENT' | ' EXCUSED_ABSENT';
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
	part: string;
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
	attendance: AttendanceStatus;
	sessions: AttendanceSession;
}
