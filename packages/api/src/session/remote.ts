import { http } from '../http';
import type {
	NextSessionHomeResponse,
	SessionAttendanceStatusTime,
	SessionDetail,
	SessionFeedbackInsight,
	SessionFeedbackMeResponse,
	SessionFeedbackPending,
	SessionFeedbackSubmissionRequest,
	SessionListItem,
	SessionTargeted,
	SessionUnTargeted,
	SessionWeek,
} from './types';

type SessionListResponse = {
	sessions: SessionListItem[];
};

type SessionWeeksResponse = {
	sessions: SessionWeek[];
};

type SessionModifyPolicyResponse = {
	targeted: SessionTargeted[];
	untargeted: SessionUnTargeted[];
};

export const session = {
	/**
	 * 세션 목록 조회
	 * 전체 세션을 확인할 수 있는 세션 리스트 조회 API입니다
	 * @returns 세션 목록
	 */
	getList: async () => {
		const res = await http.get<SessionListResponse>('v1/sessions');
		return res;
	},

	/**
	 * 세션 상세 조회
	 * 특정 주차의 세션의 상세 정보를 조회하는 API입니다.
	 * @param sessionId 세션 아이디
	 * @returns 세션 상세
	 */
	getSessionById: async (sessionId: number) => {
		const res = await http.get<SessionDetail>(`v1/sessions/${sessionId}`);
		return res;
	},

	/**
	 * 세션 피드백 인사이트 조회
	 * 응답 현황, 만족도, 항목별 집계와 자유 의견을 조회합니다.
	 */
	getFeedbackInsight: async (sessionId: number) => {
		const res = await http.get<SessionFeedbackInsight>(
			`v1/sessions/${sessionId}/feedbacks/insight`,
		);
		return res;
	},

	/** 디퍼의 세션 피드백 작성 가능 상태 조회 */
	getMyFeedbackStatus: async (sessionId: number) => {
		return await http.get<SessionFeedbackMeResponse>(`v1/sessions/${sessionId}/feedbacks/me`);
	},

	/** 디퍼가 작성 가능한 세션 피드백 조회 */
	getMyPendingFeedback: async () => {
		return await http.get<SessionFeedbackPending | undefined>('v1/sessions/feedbacks/me/pending');
	},

	/** 디퍼의 세션 피드백 제출 */
	submitFeedback: async (sessionId: number, params: SessionFeedbackSubmissionRequest) => {
		return await http.post(`v1/sessions/${sessionId}/feedbacks`, { json: params });
	},

	/**
	 * 이번주 세션 정보 조회
	 * 현재 주차의 세션 정보를 조회하는 API입니다.
	 * @param cohortId 기수 아이디
	 * @returns 이번주 세션 정보
	 */
	getCurrentWeekSession: async () => {
		const res = await http.get<NextSessionHomeResponse>('v1/sessions/next');
		return res;
	},

	editSessionAttendanceTime: async (sessionId: string, attendanceStartTime: string) => {
		const res = await http.patch(`v1/sessions/${sessionId}/attendance-time`, {
			json: {
				attendanceStartTime,
			},
		});
		return res;
	},

	getSessionWeeks: async () => {
		const res = await http.get<SessionWeeksResponse>(`v1/sessions/weeks`);
		return res;
	},

	/**
	 * 세션 추가
	 * 세션 추가하는 API 입니다.
	 * @param sessionId 세션 아이디
	 * @returns 세션 상세
	 */

	// TODO: 서버에서 데이터 타입 수정 후 타입 공통화
	createSession: async (params: {
		name: string;
		date: string;
		isOnline: boolean;
		place: string;
		week: number;
		attendanceStart: string;
		lateStart: string;
		absentStart: string;
		feedbackEnabled: boolean;
		feedbackStartAt?: string;
		feedbackPushEnabled: boolean;
	}) => {
		return await http.post(`v1/sessions`, { json: params });
	},

	modifySession: async (params: {
		sessionId: number;
		name: string;
		date: string;
		isOnline: boolean;
		place: string;
		week: number;
		attendanceStart: string;
		lateStart: string;
		absentStart: string;
		feedbackEnabled: boolean;
		feedbackStartAt?: string;
		feedbackPushEnabled: boolean;
	}) => {
		return await http.patch(`v1/sessions`, {
			json: params,
		});
	},

	deleteSession: async (params: { sessionId: number }) => {
		const { sessionId } = params;
		return await http.patch(`v1/sessions/${sessionId}/delete`);
	},

	getSessionModifyPolicy: async (params: { sessionId: number } & SessionAttendanceStatusTime) => {
		const { sessionId, ...searchParams } = params;
		return await http.get<SessionModifyPolicyResponse>(`v1/sessions/${sessionId}/update-policy`, {
			searchParams,
		});
	},
};
