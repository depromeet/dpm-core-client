import { http } from '../http';
import type {
	Session,
	SessionAttendanceCode,
	SessionAttendanceStatusTime,
	SessionTargeted,
	SessionUnTargeted,
	SessionWeek,
} from './types';

type SessionListResponse = {
	sessions: Session[];
};

type CurrentWeekSessionResponse = Session & SessionAttendanceCode;

type SessionWeeksResponse = {
	sessions: SessionWeek[];
};

type SessionDetailResponse = Session & SessionAttendanceCode & SessionAttendanceStatusTime;

type SessionModifyPolicyResponse = {
	targeted: SessionTargeted[];
	untargeted: SessionUnTargeted[];
};

export const session = {
	/**
	 * 세션 목록 조회
	 * 전체 세션을 확인할 수 있는 세션 리스트 조회 API입니다
	 * @TODO 기수 아이디는 어디서 받아오지?
	 * @param cohortId 기수 아이디
	 * @returns 세션 목록
	 */
	getList: async () => {
		const res = await http.get<SessionListResponse>('v1/sessions', {
			searchParams: {
				cohortId: 1,
			},
		});
		return res;
	},

	/**
	 * 세션 상세 조회
	 * 특정 주차의 세션의 상세 정보를 조회하는 API입니다.
	 * @param sessionId 세션 아이디
	 * @returns 세션 상세
	 */
	getSessionById: async (sessionId: number) => {
		const res = await http.get<SessionDetailResponse>(`v1/sessions/${sessionId}`);
		return res;
	},

	/**
	 * 이번주 세션 정보 조회
	 * 현재 주차의 세션 정보를 조회하는 API입니다.
	 * @param cohortId 기수 아이디
	 * @returns 이번주 세션 정보
	 */
	getCurrentWeekSession: async () => {
		const res = await http.get<CurrentWeekSessionResponse | null>('v1/sessions/next');
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

	/**
	 * 세션 출석 시작 시간 조회
	 * 세션 출석 시작 시간을 조회하는 API입니다.
	 * @param sessionId 세션 아이디
	 * @returns 세션 출석 시작 시간
	 */
	getSessionAttendanceTime: async (sessionId: number) => {
		const res = await http.get<{ attendanceStartTime: string }>(
			`v1/sessions/${sessionId}/attendance-time`,
		);
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
