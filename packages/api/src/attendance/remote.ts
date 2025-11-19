import { http } from '../http';
import type {
	AttendanceByMemberReponse,
	AttendanceBySessionIdReponse,
	AttendanceBySessionReponse,
	AttendanceCheckReponse,
	AttendanceReponse,
	AttendanceStatus,
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

	// 세션별 출석 리스트 조회
	getAttendanceBySession: async (params: {
		week: number;
		statuses?: string[];
		teams?: number[];
		name?: string;
		onlyMyTeam?: boolean;
		cursorId: number;
		size?: number;
	}) => {
		const { week, statuses, teams, name, onlyMyTeam, cursorId, size } = params;
		const searchParams = new URLSearchParams();

		if (statuses && statuses.length > 0) {
			statuses.forEach((status) => {
				searchParams.append('statuses', status);
			});
		}

		if (teams && teams.length > 0) {
			teams.forEach((team) => {
				searchParams.append('teams', team.toString());
			});
		}

		if (name) {
			searchParams.set('name', name);
		}

		if (onlyMyTeam) {
			searchParams.set('onlyMyTeam', onlyMyTeam.toString());
		}

		searchParams.set('cursorId', cursorId.toString());

		if (size) {
			searchParams.set('size', size.toString());
		}

		const res = await http.get<AttendanceBySessionReponse>(`v1/sessions/${week}/attendances`, {
			searchParams,
		});
		return res;
	},

	// 사람별 출석 리스트 조회
	getAttendanceByMember: async (params: {
		statuses?: string[];
		teams?: number[];
		name?: string;
		onlyMyTeam?: boolean;
		cursorId: number;
	}) => {
		const { statuses, teams, name, onlyMyTeam, cursorId } = params;
		const searchParams = new URLSearchParams();

		if (statuses && statuses.length > 0) {
			statuses.forEach((status) => {
				searchParams.append('statuses', status);
			});
		}

		if (teams && teams.length > 0) {
			teams.forEach((team) => {
				searchParams.append('teams', team.toString());
			});
		}

		if (name) {
			searchParams.set('name', name);
		}

		if (onlyMyTeam) {
			searchParams.set('onlyMyTeam', onlyMyTeam.toString());
		}

		searchParams.set('cursorId', cursorId.toString());

		const res = await http.get<AttendanceByMemberReponse>(`v1/members/attendances`, {
			searchParams,
		});
		return res;
	},

	// 사람별 출석 상세 조회
	getAttendanceByMemberDetail: async (params: { memberId: number }) => {
		const { memberId } = params;
		return await http.get<AttendanceReponse>(`v1/members/${memberId}/attendances`);
	},

	// 세션별 개인 출석 상세 조회
	getAttendanceBySessionDetail: async (params: { memberId: number; sessionId: number }) => {
		const { memberId, sessionId } = params;
		return await http.get<AttendanceBySessionIdReponse>(
			`v1/sessions/${sessionId}/attendances/${memberId}`,
		);
	},

	// 출석 상태 갱신
	modifyAttendanceStatus: async (params: {
		memberId: number;
		sessionId: number;
		attendanceStatus: AttendanceStatus;
	}) => {
		const { sessionId, memberId, ...json } = params;
		return await http.patch(`v1/sessions/${sessionId}/attendances/${memberId}`, {
			json,
		});
	},

	// 출석 상태 일괄 갱신
	modifyBulkAttendanceStatus: async (params: {
		sessionId: number;
		attendanceStatus: AttendanceStatus;
		memberIds: number[];
	}) => {
		const { sessionId, ...json } = params;
		return await http.patch(`v1/sessions/${sessionId}/attendances/bulk`, {
			json,
		});
	},
};
