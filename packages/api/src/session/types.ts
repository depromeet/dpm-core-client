import type { AttendanceStatus } from '../attendance';

export interface Session {
	id: number;
	week: number;
	name: string;
	place: string;
	isOnline: boolean;
	date: string;
}

export type SessionFeedbackCollectionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'CLOSED';

export interface SessionListFeedback {
	status: SessionFeedbackCollectionStatus;
	endAt: string;
	canSubmit: boolean;
}

export type SessionListItem = Session & {
	feedback: SessionListFeedback | null;
};

export interface SessionAttendanceStatusTime {
	attendanceStart: string;
	lateStart: string;
	absentStart: string;
}

export interface SessionAttendanceCode {
	attendanceCode: string;
}

export interface SessionWeek {
	id: Session['id'];
	week: Session['week'];
	date: Session['date'];
}

export interface SessionTargeted {
	name: string;
	currentStatus: AttendanceStatus;
	targetStatus: AttendanceStatus;
	attendedAt: string;
}

export interface SessionUnTargeted {
	name: string;
	status: AttendanceStatus;
	updatedAt: string;
}

export type CurrentWeekSessionResponse = Session &
	SessionAttendanceStatusTime &
	SessionAttendanceCode;
