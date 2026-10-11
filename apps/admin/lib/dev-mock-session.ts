import type { Session, SessionListItem } from '@dpm-core/api';

export const MOCK_SESSIONS: Session[] = [
	{
		id: 35,
		week: 1,
		name: '세션 피드백 테스트 세션',
		place: '온라인',
		isOnline: true,
		date: '2026-03-14T14:00:00+09:00',
	},
	{
		id: 36,
		week: 2,
		name: '아이디어 공유/피드백',
		place: '온라인',
		isOnline: true,
		date: '2026-03-21T13:00:00+09:00',
	},
	{
		id: 37,
		week: 3,
		name: '현직자와의 만남',
		place: '공덕',
		isOnline: false,
		date: '2026-03-28T13:00:00+09:00',
	},
	{
		id: 38,
		week: 4,
		name: '캐주얼 네트워킹',
		place: '온라인',
		isOnline: true,
		date: '2026-04-04T15:00:00+09:00',
	},
];

const MOCK_SESSION_FEEDBACK: Record<number, SessionListItem['feedback']> = {
	35: {
		status: 'SCHEDULED',
		endAt: '2026-10-14T18:00:00+09:00',
		canSubmit: false,
	},
	36: {
		status: 'IN_PROGRESS',
		endAt: '2026-10-14T18:00:00+09:00',
		canSubmit: true,
	},
	37: {
		status: 'CLOSED',
		endAt: '2026-10-08T18:00:00+09:00',
		canSubmit: false,
	},
	38: null,
};

export const createMockSessionListResponse = () => ({
	status: 'OK',
	code: 'GLOBAL-200-01',
	message: '요청에 성공했습니다',
	data: {
		sessions: MOCK_SESSIONS.map((session) => ({
			...session,
			feedback: MOCK_SESSION_FEEDBACK[session.id] ?? null,
		})),
	},
});

export const createMockCurrentWeekSessionResponse = () => ({
	status: 'SUCCESS',
	code: 'SUCCESS',
	message: 'success',
	data: {
		...MOCK_SESSIONS[0],
		attendanceCode: '1234',
		attendanceStart: '2026-03-14T14:00:00+09:00',
		lateStart: '2026-03-14T14:30:00+09:00',
		absentStart: '2026-03-14T15:00:00+09:00',
	},
});

export const createMockSessionDetailResponse = (sessionId: number) => {
	const session = MOCK_SESSIONS.find(({ id }) => id === sessionId) ?? MOCK_SESSIONS[0];

	return {
		status: 'SUCCESS',
		code: 'SUCCESS',
		message: 'success',
		data: {
			...session,
			attendanceCode: '1234',
			attendanceStart: '2026-03-14T14:00:00+09:00',
			lateStart: '2026-03-14T14:30:00+09:00',
			absentStart: '2026-03-14T15:00:00+09:00',
		},
	};
};

export const createMockSessionWeeksResponse = () => ({
	status: 'SUCCESS',
	code: 'SUCCESS',
	message: 'success',
	data: {
		sessions: MOCK_SESSIONS.map(({ id, week, date }) => ({ id, week, date })),
	},
});
