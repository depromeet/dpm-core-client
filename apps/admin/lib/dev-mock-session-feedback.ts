import type { ApiResponse, SessionFeedbackInsight } from '@dpm-core/api';

import { MOCK_SESSIONS } from './dev-mock-session';

const MOCK_SESSION_FEEDBACK_INSIGHT: SessionFeedbackInsight = {
	sessionId: 36,
	sessionName: '아이디어 공유/피드백',
	status: 'IN_PROGRESS',
	startAt: '2026-10-08T18:00:00',
	endAt: '2026-10-14T18:00:00',
	responseSummary: {
		respondentCount: 50,
		targetCount: 80,
		responseRate: 63,
	},
	satisfaction: {
		average: 4.2,
		maxScore: 5,
		distribution: [
			{ code: 'VERY_SATISFIED', label: '매우 만족', count: 25, rate: 50 },
			{ code: 'SATISFIED', label: '만족', count: 16, rate: 32 },
			{ code: 'NEUTRAL', label: '보통', count: 4, rate: 8 },
			{ code: 'DISSATISFIED', label: '불만족', count: 3, rate: 6 },
			{ code: 'VERY_DISSATISFIED', label: '매우 불만족', count: 2, rate: 4 },
		],
	},
	likedAspects: {
		respondentCount: 50,
		items: [
			{ code: 'SESSION_CONTENT', label: '세션 내용', count: 32, rate: 64 },
			{ code: 'PROGRESS_AND_TIME', label: '진행 방식·시간', count: 22, rate: 44 },
			{ code: 'NETWORKING', label: '교류 기회', count: 10, rate: 20 },
			{ code: 'GUIDANCE', label: '사전·현장 안내', count: 7, rate: 14 },
			{ code: 'PLACE_AND_ACCESS', label: '장소·접속 환경', count: 4, rate: 8 },
			{ code: 'NOTHING', label: '특별히 없음', count: 2, rate: 4 },
		],
		etcComments: [],
	},
	improvementAspects: {
		respondentCount: 50,
		items: [
			{ code: 'PROGRESS_AND_TIME', label: '진행 방식·시간', count: 14, rate: 28 },
			{ code: 'SESSION_CONTENT', label: '세션 내용', count: 9, rate: 18 },
			{ code: 'NOTHING', label: '특별히 없음', count: 7, rate: 14 },
			{ code: 'GUIDANCE', label: '사전·현장 안내', count: 5, rate: 10 },
			{ code: 'NETWORKING', label: '교류 기회', count: 3, rate: 6 },
			{ code: 'PLACE_AND_ACCESS', label: '장소·접속 환경', count: 2, rate: 4 },
			{ code: 'ETC', label: '기타', count: 3, rate: 6 },
		],
		etcComments: [
			'질문 시간이 조금 더 길었으면 좋겠어요.',
			'세션 자료를 미리 공유해주면 좋겠어요.',
		],
	},
	freeComments: {
		count: 9,
		items: [
			'활동 방향을 이해하는 데 도움이 되었어요. 다른 팀과 이야기할 시간이 조금 더 있으면 좋겠어요.',
			'이번 세션은 전체적으로 진행 흐름이 매끄럽고 내용도 이해하기 쉽게 구성되어 있어 좋았습니다. 특히 실제 사례를 중심으로 설명해주셔서 단순히 개념만 듣는 것보다 훨씬 기억에 잘 남았고, 이후 팀 프로젝트에서 어떻게 적용할 수 있을지 생각해볼 수 있었습니다. 다만 후반부에는 전달되는 정보가 많아 메모하면서 따라가기 어려운 순간도 있었습니다. 다음에는 중간중간 핵심 내용을 정리하는 시간을 조금 더 두고, 질문을 나눌 수 있는 시간을 충분히 확보해주시면 더 좋을 것 같습니다.',
			'팀원들과 자연스럽게 교류할 수 있어서 좋았어요. 안내 내용도 사전에 확인하기 쉬웠습니다.',
			'세션에서 다룬 주제가 흥미로웠고 실제 활동 방향을 잡는 데 도움이 됐습니다.',
			'진행 속도가 적당해서 내용을 따라가기 좋았습니다. 다음 세션도 기대돼요.',
			'현장 안내를 조금 더 일찍 공유해주시면 처음 참석하는 사람에게 도움이 될 것 같습니다.',
			'다른 직군의 디퍼들과 이야기할 수 있는 시간이 인상적이었습니다.',
			'장소를 찾는 데 시간이 걸려서 위치 안내가 조금 더 자세하면 좋겠습니다.',
			'전체적으로 만족스러웠고 다음에는 소그룹 대화 시간이 조금 더 길면 좋겠어요.',
		],
	},
};

const createEmptyInsight = (
	sessionId: number,
	status: SessionFeedbackInsight['status'],
): SessionFeedbackInsight => ({
	...MOCK_SESSION_FEEDBACK_INSIGHT,
	sessionId,
	sessionName: MOCK_SESSIONS.find((session) => session.id === sessionId)?.name ?? '세션 피드백',
	status,
	startAt:
		status === 'SCHEDULED'
			? '2026-10-12T18:00:00'
			: status === 'CLOSED'
				? '2026-10-05T18:00:00'
				: '2026-10-08T18:00:00',
	endAt:
		status === 'CLOSED'
			? '2026-10-08T18:00:00'
			: status === 'SCHEDULED'
				? '2026-10-15T18:00:00'
				: '2026-10-14T18:00:00',
	responseSummary: {
		respondentCount: 0,
		targetCount: 80,
		responseRate: 0,
	},
	satisfaction: {
		average: 0,
		maxScore: 5,
		distribution: MOCK_SESSION_FEEDBACK_INSIGHT.satisfaction.distribution.map((item) => ({
			...item,
			count: 0,
			rate: 0,
		})),
	},
	likedAspects: {
		respondentCount: 0,
		items: MOCK_SESSION_FEEDBACK_INSIGHT.likedAspects.items.map((item) => ({
			...item,
			count: 0,
			rate: 0,
		})),
		etcComments: [],
	},
	improvementAspects: {
		respondentCount: 0,
		items: MOCK_SESSION_FEEDBACK_INSIGHT.improvementAspects.items
			.filter(({ code }) => code !== 'ETC')
			.map((item) => ({ ...item, count: 0, rate: 0 })),
		etcComments: [],
	},
	freeComments: { count: 0, items: [] },
});

export const createMockSessionFeedbackInsightResponse = (
	sessionId: number,
): ApiResponse<SessionFeedbackInsight> => {
	const insight =
		sessionId === 35
			? createEmptyInsight(sessionId, 'SCHEDULED')
			: sessionId === 37
				? createEmptyInsight(sessionId, 'CLOSED')
				: sessionId === 39
					? createEmptyInsight(sessionId, 'IN_PROGRESS')
					: { ...MOCK_SESSION_FEEDBACK_INSIGHT, sessionId };

	return {
		status: 'OK',
		message: '요청에 성공했습니다',
		code: 'GLOBAL-200-01',
		data: insight,
	};
};
