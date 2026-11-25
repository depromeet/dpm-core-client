import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
	HOME_CLOCK,
	homeAnnouncement,
	homeSession,
	homeSessionFeedback,
	homeSessionItem,
} from './home-cases';
import { HomePreview } from './home-preview';

const meta = {
	title: 'Cases/홈/본문',
	component: HomePreview,
} satisfies Meta<typeof HomePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
	name: '정기 세션과 이전 피드백',
	parameters: {
		caseConditions: [
			'일반 회원이 출석이 시작되기 전에 홈을 열었어요.',
			'운영진이 홈을 열었어요. 운영진에게는 출석 시작 후에도 인증 배너가 표시되지 않아요.',
		],
	},
};
export const AssignmentAnnouncement: Story = {
	name: '과제 공지',
	args: {
		scenario: {
			announcements: [
				{
					...homeAnnouncement,
					title: '팀별 과제를 제출해 주세요',
					announcementType: 'ASSIGNMENT',
					assignmentType: 'TEAM',
				},
			],
		},
	},
};
export const NoAnnouncement: Story = {
	name: '공지 배너 없음',
	parameters: {
		caseConditions: [
			'등록된 공지가 없어요.',
			'공지 조회에 실패했어요. 세션 카드와 나머지 영역은 표시돼요.',
		],
	},
	args: { scenario: { announcements: [] } },
};
export const AnnouncementLoading: Story = {
	name: '공지만 조회 중',
	args: { scenario: { announcements: 'loading' } },
};
export const AnnouncementFailed: Story = {
	name: '공지만 조회 실패',
	tags: ['!dev'],
	args: { scenario: { announcements: 'failed' } },
};
export const SessionLoading: Story = {
	name: '세션만 조회 중',
	args: { scenario: { session: 'loading' } },
};
export const SessionFailed: Story = {
	name: '세션만 조회 실패',
	args: { scenario: { session: 'failed' } },
};
export const Loading: Story = {
	name: '공지와 세션 조회 중',
	args: { scenario: { announcements: 'loading', session: 'loading' } },
};
export const Failed: Story = {
	name: '공지와 세션 조회 실패',
	args: { scenario: { announcements: 'failed', session: 'failed' } },
};

export const OnlineSession: Story = {
	name: '온라인 세션',
	args: {
		scenario: {
			session: { ...homeSession, session: { ...homeSessionItem, isOnline: true, place: '' } },
		},
	},
};

export const SessionNotRegistered: Story = {
	name: '다음 세션 미등록',
	args: { scenario: { session: { status: 'NOT_REGISTERED', cohortValue: '17', session: null } } },
};

export const CohortEndedWithAnnouncement: Story = {
	name: '내 기수 종료 · 현재 기수 공지 있음',
	tags: ['!dev'],
	args: { scenario: { session: { status: 'COHORT_ENDED', cohortValue: '16', session: null } } },
};

export const NoMemberCohort: Story = {
	name: '회원의 소속 기수 없음',
	args: { scenario: { session: { status: 'COHORT_ENDED', cohortValue: null, session: null } } },
};

export const NoActiveCohort: Story = {
	name: '활성 기수 없음',
	tags: ['!dev'],
	args: {
		scenario: {
			session: { status: 'COHORT_ENDED', cohortValue: '16', session: null },
			announcements: [],
		},
	},
};

export const FeedbackUnavailable: Story = {
	name: '피드백 카드 없음',
	tags: ['!dev'],
	parameters: {
		caseConditions: [
			'작성할 피드백이 없거나, 이미 제출했거나, 작성 기간이 끝났거나, 작성 자격이 없어요.',
			'피드백을 조회 중이거나 조회에 실패했어요.',
		],
	},
	args: { scenario: { feedback: null } },
};
export const FeedbackLoading: Story = {
	name: '피드백 조회 중',
	tags: ['!dev'],
	args: { scenario: { feedback: 'loading' } },
};
export const FeedbackFailed: Story = {
	name: '피드백 조회 실패',
	tags: ['!dev'],
	args: { scenario: { feedback: 'failed' } },
};
export const FeedbackDuringAttendance: Story = {
	name: '출석 진행 중 피드백 숨김',
	tags: ['!dev'],
	args: { scenario: { now: HOME_CLOCK.attendanceOpen } },
};

export const FeedbackAfterLateParticipation: Story = {
	name: '늦은 참여 이후 피드백 가능',
	args: {
		scenario: {
			now: HOME_CLOCK.nextDay,
			session: { status: 'NOT_REGISTERED', cohortValue: '17', session: null },
			feedback: homeSessionFeedback,
		},
	},
};
