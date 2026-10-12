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

export type SessionFeedbackMyStatus =
	| 'AVAILABLE'
	| 'BEFORE_START'
	| 'SUBMITTED'
	| 'EXPIRED'
	| 'NOT_TARGET';

export interface SessionFeedbackMeResponse {
	sessionName: string;
	myStatus: SessionFeedbackMyStatus;
	startAt: string | null;
}

export interface SessionFeedbackSubmissionRequest {
	satisfaction: SessionFeedbackSatisfaction;
	likedAspects: SessionFeedbackAspect[];
	likedEtc: string | null;
	improvementAspects: SessionFeedbackAspect[];
	improvementEtc: string | null;
	freeComment: string | null;
}

export type SessionFeedbackSatisfaction =
	| 'VERY_SATISFIED'
	| 'SATISFIED'
	| 'NEUTRAL'
	| 'DISSATISFIED'
	| 'VERY_DISSATISFIED';

export type SessionFeedbackAspect =
	| 'SESSION_CONTENT'
	| 'PROGRESS_AND_TIME'
	| 'NETWORKING'
	| 'GUIDANCE'
	| 'PLACE_AND_ACCESS'
	| 'ETC'
	| 'NOTHING';

export interface SessionListFeedback {
	status: SessionFeedbackCollectionStatus;
	endAt: string;
	canSubmit: boolean;
}

export interface SessionDetailFeedback {
	status: SessionFeedbackCollectionStatus;
	startAt: string;
	endAt: string;
	pushEnabled: boolean;
}

export interface SessionFeedbackInsight {
	sessionId: number;
	sessionName: string;
	status: SessionFeedbackCollectionStatus;
	startAt: string;
	endAt: string;
	responseSummary: {
		respondentCount: number;
		targetCount: number;
		responseRate: number;
	};
	satisfaction: {
		average: number;
		maxScore: number;
		distribution: {
			code: SessionFeedbackSatisfaction;
			label: string;
			count: number;
			rate: number;
		}[];
	};
	likedAspects: SessionFeedbackAspectSummary;
	improvementAspects: SessionFeedbackAspectSummary;
	freeComments: {
		count: number;
		items: string[];
	};
}

interface SessionFeedbackAspectSummary {
	respondentCount: number;
	items: {
		code: SessionFeedbackAspect;
		label: string;
		count: number;
		rate: number;
	}[];
	etcComments: string[];
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

export type SessionDetail = Session &
	SessionAttendanceCode &
	SessionAttendanceStatusTime & {
		feedback: SessionDetailFeedback | null;
	};

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
