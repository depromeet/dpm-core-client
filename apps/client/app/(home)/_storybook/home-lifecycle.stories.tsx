import preview from '../../../.storybook/preview';
import { makeAttendanceSubmission } from './attendance-sheet.fixtures';
import { attendanceSheetPlay } from './attendance-sheet.play';
import {
	HOME_CLOCK,
	homeAnnouncement,
	homeSession,
	homeSessionFeedback,
	homeSessionItem,
} from './home-cases';
import { HomePreview } from './home-preview';

const meta = preview.meta({
	title: 'Cases/홈/활동 흐름',
	component: HomePreview,
});

const finalSessionDay = '2026-12-05';
const finalSession: typeof homeSessionItem = {
	...homeSessionItem,
	id: 3,
	week: 7,
	name: '팀별 최종 발표',
	date: `${finalSessionDay}T14:00:00+09:00`,
	attendanceStart: `${finalSessionDay}T13:30:00+09:00`,
	lateStart: `${finalSessionDay}T14:00:00+09:00`,
	absentStart: `${finalSessionDay}T14:30:00+09:00`,
	lateParticipationDeadline: `${finalSessionDay}T19:00:00+09:00`,
};

export const BeforeKickoff = meta.story({
	name: '활동 시작 전 · 첫 안내',
	parameters: {
		caseConditions: [
			'새 기수가 시작됐고 첫 안내 공지는 올라왔지만, 세션은 아직 등록되지 않았어요.',
		],
	},
	args: {
		scenario: {
			now: '2026-10-17T10:00:00+09:00',
			announcements: [
				{
					...homeAnnouncement,
					title: '17기 활동 일정을 곧 안내해 드릴게요',
					createdAt: '2026-10-17T09:00:00+09:00',
				},
			],
			session: { status: 'NOT_REGISTERED', cohortValue: '17', session: null },
			feedback: null,
		},
	},
});

export const BeforeSession = meta.story({
	name: '정기 세션 전 · 일정 확인',
	parameters: {
		caseConditions: [
			'다음 정기 세션이 등록됐고 출석 시간이 되기 전이에요.',
			'작성할 피드백이 없거나 이미 제출했어요. 작성 기간이 끝났거나 작성 자격이 없을 때도 피드백 카드는 표시되지 않아요.',
			'피드백을 조회 중이거나 조회에 실패했을 때도 카드가 표시되지 않아요.',
		],
	},
	args: { scenario: { feedback: null } },
});

const sessionDayScenario = { now: HOME_CLOCK.attendanceOpen, feedback: null };

export const SessionDay = meta.story({
	name: '세션 당일 · 출석 인증',
	parameters: {
		caseConditions: [
			'출석을 시작했고 아직 지각 시간이 되지 않았어요. 올바른 코드로 제출하면 정상 출석으로 기록돼요.',
			'출석 배너가 표시되는 동안에는 작성할 피드백이 있어도 피드백 카드가 숨겨져요.',
		],
	},
	args: { scenario: sessionDayScenario },
});

export const AfterSession = meta.story({
	name: '세션 다음 날 · 피드백',
	parameters: {
		caseConditions: [
			'어제 참석한 6주차 세션의 피드백 작성 기간이 열려 있고 아직 제출하지 않았어요.',
			'다음 세션으로 7주차 일정이 등록돼 있어요. 늦은 참여를 등록한 회원도 피드백을 작성할 수 있어요.',
		],
	},
	args: {
		scenario: {
			now: HOME_CLOCK.nextDay,
			session: { ...homeSession, session: finalSession },
			feedback: homeSessionFeedback,
		},
	},
});

export const CohortClosed = meta.story({
	name: '기수 종료 · 활동 마무리',
	parameters: {
		caseConditions: [
			'내 기수의 활동이 끝났고, 표시할 공지나 작성할 피드백이 없어요.',
			'다음 기수의 공지가 올라오면 활동 종료 안내 위에 공지 배너가 함께 표시될 수 있어요.',
		],
	},
	args: {
		scenario: {
			now: '2026-12-13T09:00:00+09:00',
			announcements: [],
			session: { status: 'COHORT_ENDED', cohortValue: '17', session: null },
			feedback: null,
		},
	},
});

SessionDay.test('시트를 열면 코드 입력란이 비어 있어요', attendanceSheetPlay.Empty);

SessionDay.test('코드를 세 자리만 입력하면 제출할 수 없어요', attendanceSheetPlay.Partial);

SessionDay.test('코드를 네 자리 입력하면 제출할 수 있어요', attendanceSheetPlay.Ready);

SessionDay.test(
	'제출 중에는 다시 제출하거나 시트를 닫을 수 없어요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('pending', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.Pending,
);

SessionDay.test('올바른 코드를 제출하면 출석이 완료돼요', attendanceSheetPlay.Present);

SessionDay.test('틀린 코드를 제출하면 다시 입력할 수 있어요', attendanceSheetPlay.WrongCode);

SessionDay.test(
	'인증 시작 전이면 안내가 표시돼요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('tooEarly', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.TooEarly,
);
SessionDay.test(
	'이미 출석했다면 안내가 표시돼요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('alreadyRegistered', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.AlreadyRegistered,
);
SessionDay.test(
	'인증이 마감됐으면 안내가 표시돼요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('closed', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.Closed,
);
SessionDay.test(
	'운영진이 출석 상태를 확정했으면 안내가 표시돼요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('manuallyUpdated', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.ManuallyUpdated,
);
SessionDay.test(
	'운영진이 인증을 시도하면 안내가 표시돼요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('organizer', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.Organizer,
);
SessionDay.test(
	'서버 오류가 발생하면 문의 안내가 표시돼요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('server', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.ServerError,
);
SessionDay.test(
	'연결에 실패하면 네트워크 확인 안내가 표시돼요',
	{
		args: {
			scenario: {
				...sessionDayScenario,
				attendanceSheet: makeAttendanceSubmission('network', sessionDayScenario.now),
			},
		},
	},
	attendanceSheetPlay.NetworkError,
);
