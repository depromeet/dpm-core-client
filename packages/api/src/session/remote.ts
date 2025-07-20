import { http } from '../http';
import type { CurrentWeekSession, Session, SessionDetail } from './types';

type SessionListResponse = {
	sessions: Session[];
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
		const res = await http.get<SessionDetail>(`v1/sessions/${sessionId}`);
		return res;
	},

	/**
	 * 이번주 세션 정보 조회
	 * 현재 주차의 세션 정보를 조회하는 API입니다.
	 * @param cohortId 기수 아이디
	 * @returns 이번주 세션 정보
	 */
	getCurrentWeekSession: async () => {
		const res = await http.get<CurrentWeekSession | null>('v1/sessions/next');
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
};
