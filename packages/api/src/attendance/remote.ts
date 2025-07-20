import { http } from '../http';
import type {
	AttendanceBySessionIdReponse,
	AttendanceCheckReponse,
	AttendanceReponse,
} from './types';

export const attendance = {
	// 세션 출석 채크
	check: async (params: { sessionId: number; attendanceCode: string }) => {
		const { sessionId, ...json } = params;
		const res = await http.post<AttendanceCheckReponse>(`v1/sessions/${sessionId}/attendances`, {
			json,
		});
		return res;
	},

	// 내 출석 정보 조회
	getMe: async () => {
		const res = await http.get<AttendanceReponse>(`v1/members/me/attendances`);
		return res;
	},

	// 내 출석 세션별 정보 조회
	getMeBySessionId: async (params: { sessionId: number }) => {
		const { sessionId } = params;
		const res = await http.get<AttendanceBySessionIdReponse>(
			`v1/sessions/${sessionId}/attendances/me`,
		);
		return res;
	},
};
