import type { Part } from '../member';
export type AttendanceStatus =
	| 'PRESENT'
	| 'LATE'
	| 'ABSENT'
	| 'EXCUSED_ABSENT'
	| 'PENDING'
	| 'EARLY_LEAVE';
export type MemberAttendanceStatus = 'NORMAL' | 'AT_RISK' | 'IMPOSSIBLE';

export interface AttendanceSession {
	id: number;
	week: number;
	eventName: string;
	date: string;
	attendanceStatus: AttendanceStatus;
	place: string;
}

export interface AttendanceMember {
	id: number;
	name: string;
	teamNumber: number;
	isAdmin: boolean;
	part: Exclude<Part, 'ETC'>;
	attendanceStatus: MemberAttendanceStatus;
}

export interface Attendance {
	presentCount: number;
	lateCount: number;
	excusedAbsentCount: number;
	absentCount: number;
	earlyLeaveCount: number;
}

export interface AttendanceReponse {
	member: AttendanceMember;
	attendance: Attendance;
	sessions: AttendanceSession[];
}

export interface AttendanceBySessionIdReponse {
	member: AttendanceMember;
	attendance: {
		status: AttendanceStatus;
		attendedAt: string;
		updatedAt: string;
	};
	session: AttendanceSession;
}

export interface MyAttendanceBySessionIdResponse {
	attendance: {
		status: AttendanceStatus;
		attendedAt: string;
	};
	session: {
		week: number;
		eventName: string;
		date: string;
		place: string | null;
	};
}

export interface AttendanceCheckReponse {
	attendanceStatus: AttendanceStatus;
	attendedAt: string;
}

export interface AttendanceBySessionMember {
	id: number;
	name: string;
	teamNumber: number | null;
	isAdmin: boolean;
	part: Exclude<Part, 'ETC'>;
	attendanceStatus: AttendanceStatus;
	attendedAt: string | null;
	isManuallyUpdated: boolean;
	absenceReason: string | null;
}

// GET /v3/sessions/{sessionId}/attendances
export interface AttendanceBySessionResponse {
	members: AttendanceBySessionMember[];
	myTeamNumber: number | null;
	totalElements: number;
}

export type ExcuseDocumentStatus = 'SUBMITTED' | 'PENDING' | null;

export type AbsenceReasonStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SubmitAbsenceReasonRequest {
	sessionId: number;
	contents: string;
	imageIds: number[];
}

export interface ImageResponse {
	imageId: number;
	fileName: string | null;
}

export interface MyAbsenceReasonResponse {
	images: ImageResponse[];
	contents: string;
	status: AbsenceReasonStatus;
	imageIds: number[];
	createdAt: string;
	updatedAt: string | null;
}

export interface AbsenceReason {
	memberId: number;
	memberName: string;
	contents: string;
	status: ExcuseDocumentStatus;
	createdAt: string;
	updatedAt: string;
}

export interface AbsenceReasonsResponse {
	reasons: AbsenceReason[];
}

export interface AttendanceByMemberReponse {
	members: {
		id: number;
		name: string;
		teamNumber: number;
		isAdmin: boolean;
		part: Exclude<Part, 'ETC'>;
		attendanceStatus: MemberAttendanceStatus;
	}[];
	hasNext: boolean;
	nextCursorId: number | null;
	totalElements: number;
}

export interface MyAttendanceAbsenceReason {
	id: number;
	contents: string;
	status: AbsenceReasonStatus;
	imageIds: number[];
	images: ImageResponse[];
}

export interface MyAttendanceSession extends AttendanceSession {
	attendedAt: string | null;
	isOnline: boolean;
	absenceReason: MyAttendanceAbsenceReason | null;
}

export interface MyAttendanceResponse {
	member: Omit<AttendanceMember, 'teamNumber' | 'part'> & {
		teamNumber: number | null;
		part: string | null;
	};
	attendance: Pick<Attendance, 'presentCount' | 'lateCount' | 'excusedAbsentCount' | 'absentCount'>;
	sessions: MyAttendanceSession[];
}
