import preview from '../../../.storybook/preview';
import { attendanceSheetPlay } from './attendance-sheet.play';
import {
	HOME_CLOCK,
	homeSession,
	homeSessionItem,
	makeAbsenceReason,
	makeAttendance,
} from './home-cases';
import { HomePreview } from './home-preview';

const meta = preview.meta({
	title: 'Cases/홈/출석 배너',
	component: HomePreview,
});

export const Organizer = meta.story({
	name: '운영진 · 출석 권한 없음',
	tags: ['!dev'],
	args: {
		scenario: {
			now: HOME_CLOCK.attendanceOpen,
			session: {
				...homeSession,
				session: { ...homeSessionItem, canRecordAttendance: false, attendanceCode: '1234' },
			},
		},
	},
});

export const BeforeAttendance = meta.story({ name: '출석 시작 직전', tags: ['!dev'] });
export const AttendanceLoading = meta.story({
	name: '출석 배너 없음 · 출석 정보 확인 중 또는 실패',
	parameters: {
		caseConditions: [
			'내 출석 정보 또는 결석 사유서를 조회 중이에요.',
			'내 출석 정보 조회에 실패했고, 검토 중인 결석 사유서가 없어요.',
		],
	},
	args: { scenario: { now: HOME_CLOCK.attendanceOpen, attendance: 'loading' } },
});
export const AbsenceReasonLoading = meta.story({
	name: '결석 사유서 조회 중',
	tags: ['!dev'],
	args: { scenario: { now: HOME_CLOCK.attendanceOpen, absenceReason: 'loading' } },
});
export const AttendanceUnavailable = meta.story({
	name: '개인 출석 정보 조회 실패',
	tags: ['!dev'],
	args: { scenario: { now: HOME_CLOCK.attendanceOpen, attendance: 'failed' } },
});
export const AttendanceOpen = meta.story({
	name: '정상 출석 가능',
	tags: ['!dev'],
	parameters: {
		caseConditions: [
			'출석을 시작했고 아직 지각 시간이 되지 않았어요. 올바른 코드로 제출하면 정상 출석으로 기록돼요.',
			'출석 시간에는 작성할 피드백이 있어도 피드백 카드가 숨겨져요.',
		],
	},
	args: { scenario: { now: HOME_CLOCK.attendanceOpen } },
});
export const LateOpen = meta.story({
	name: '지각 출석 가능',
	parameters: {
		caseConditions: [
			'지각이 시작됐고 아직 지각 마감 전이에요. 올바른 코드로 제출하면 지각으로 기록돼요.',
			'출석 시간에는 작성할 피드백이 있어도 피드백 카드가 숨겨져요.',
		],
	},
	args: { scenario: { now: HOME_CLOCK.lateOpen } },
});
export const Present = meta.story({
	name: '출석 완료',
	args: {
		scenario: {
			now: HOME_CLOCK.lateOpen,
			attendance: makeAttendance('PRESENT', { attendedAt: HOME_CLOCK.attendanceOpen }),
		},
	},
});
export const Late = meta.story({
	name: '지각 완료',
	args: {
		scenario: {
			now: HOME_CLOCK.lateParticipation,
			attendance: makeAttendance('LATE', { attendedAt: HOME_CLOCK.lateOpen }),
		},
	},
});
export const LateParticipationOpen = meta.story({
	name: '늦은 참여 가능',
	parameters: {
		caseConditions: [
			'지각 마감 시각부터 세션 당일 오후 7시 직전까지 늦은 참여를 등록할 수 있어요.',
			'등록하면 출석 집계는 결석으로 유지되고, 해당 세션의 피드백을 작성할 수 있어요.',
		],
	},
	args: {
		scenario: {
			now: HOME_CLOCK.lateParticipation,
			attendance: makeAttendance('ABSENT', { canRegisterLateParticipation: true }),
		},
	},
});
export const BeforeDeadline = meta.story({
	name: '19시 직전 · 늦은 참여 가능',
	tags: ['!dev'],
	args: {
		scenario: {
			now: HOME_CLOCK.beforeDeadline,
			attendance: makeAttendance('ABSENT', { canRegisterLateParticipation: true }),
		},
	},
});
export const LateParticipationRecorded = meta.story({
	name: '늦은 참여 등록 완료 · 결석 집계',
	tags: ['!dev'],
	args: {
		scenario: {
			now: HOME_CLOCK.beforeDeadline,
			attendance: makeAttendance('ABSENT', { attendedAt: HOME_CLOCK.lateParticipation }),
		},
	},
});
export const OrganizerDecidedAbsence = meta.story({
	name: '운영진 확정 결석 · 늦은 참여 불가',
	tags: ['!dev'],
	args: { scenario: { now: HOME_CLOCK.beforeDeadline, attendance: makeAttendance('ABSENT') } },
});
export const Deadline = meta.story({
	name: '결석 · 출석 인증 마감',
	parameters: {
		caseConditions: [
			'세션 당일 오후 7시까지 늦은 참여를 등록하지 않았어요.',
			'늦은 참여 등록을 완료했어요. 출석 집계는 결석으로 남고, 피드백을 작성할 자격이 생겨요.',
			'운영진이 출석 상태를 결석으로 확정해 늦은 참여를 등록할 수 없어요.',
			'결석 사유서가 반려됐고 출석 상태가 결석이에요.',
		],
	},
	args: { scenario: { now: HOME_CLOCK.deadline, attendance: makeAttendance('ABSENT') } },
});
export const AbsenceUnderReview = meta.story({
	name: '결석 사유서 검토 중',
	args: {
		scenario: {
			now: HOME_CLOCK.deadline,
			attendance: makeAttendance('ABSENT'),
			absenceReason: makeAbsenceReason('PENDING'),
		},
	},
});
export const ExcusedAbsent = meta.story({
	name: '결석 사유서 승인',
	args: {
		scenario: {
			now: HOME_CLOCK.deadline,
			attendance: makeAttendance('EXCUSED_ABSENT'),
			absenceReason: makeAbsenceReason('APPROVED'),
		},
	},
});
export const AbsenceRejected = meta.story({
	name: '결석 사유서 반려',
	tags: ['!dev'],
	args: {
		scenario: {
			now: HOME_CLOCK.deadline,
			attendance: makeAttendance('ABSENT'),
			absenceReason: makeAbsenceReason('REJECTED'),
		},
	},
});

LateOpen.test('올바른 코드를 제출하면 지각으로 기록돼요', attendanceSheetPlay.Late);
LateParticipationOpen.test(
	'올바른 코드를 제출하면 늦은 참여로 등록돼요',
	attendanceSheetPlay.LateParticipation,
);
