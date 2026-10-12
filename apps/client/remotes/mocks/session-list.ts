import type { ApiResponse, SessionListItem } from '@dpm-core/api';

export const MOCK_SESSION_LIST_RESPONSE: ApiResponse<{ sessions: SessionListItem[] }> = {
	status: 'OK',
	code: 'GLOBAL-200-01',
	message: '요청에 성공했습니다',
	data: {
		sessions: [
			{
				id: 35,
				week: 1,
				name: 'OT & 팀빌딩',
				place: '공덕',
				isOnline: false,
				date: '2026-09-05T14:00:00',
				feedback: null,
			},
			{
				id: 36,
				week: 2,
				name: '아이디어 공유/피드백',
				place: '온라인',
				isOnline: true,
				date: '2026-09-12T13:00:00',
				feedback: {
					status: 'SCHEDULED',
					endAt: '2026-09-15T13:00:00',
					canSubmit: false,
				},
			},
			{
				id: 37,
				week: 3,
				name: '현직자와의 만남',
				place: '공덕',
				isOnline: false,
				date: '2026-09-19T13:10:00',
				feedback: {
					status: 'IN_PROGRESS',
					endAt: '2026-10-15T18:00:00',
					canSubmit: true,
				},
			},
			{
				id: 38,
				week: 4,
				name: '프로젝트 기획',
				place: '온라인',
				isOnline: true,
				date: '2026-09-26T14:00:00',
				feedback: {
					status: 'IN_PROGRESS',
					endAt: '2026-09-29T18:00:00',
					canSubmit: false,
				},
			},
			{
				id: 39,
				week: 5,
				name: '서비스 디자인 워크숍',
				place: '공덕',
				isOnline: false,
				date: '2026-10-03T14:00:00',
				feedback: {
					status: 'CLOSED',
					endAt: '2026-10-06T18:00:00',
					canSubmit: false,
				},
			},
		],
	},
};
