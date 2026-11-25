import type {
	AbsenceReasonStatus,
	Announcement,
	ApiResponse,
	AttendanceStatus,
	CurrentWeekSessionResponse,
	MyAbsenceReasonResponse,
	MyAttendanceBySessionIdResponse,
	NextSessionHomeResponse,
	SessionFeedbackPending,
} from '@dpm-core/api';

const sessionDay = '2026-11-28';
const at = (time: string) => `${sessionDay}T${time}:00+09:00`;

export const HOME_CLOCK = {
	beforeAttendance: at('13:29'),
	attendanceOpen: at('13:30'),
	lateOpen: at('14:00'),
	lateParticipation: at('14:30'),
	beforeDeadline: at('18:59'),
	deadline: at('19:00'),
	nextDay: '2026-11-29T09:00:00+09:00',
};

export const homeAnnouncement: Announcement = {
	announcementId: 1,
	title: '다음 정기 세션 일정을 확인해 주세요',
	announcementType: 'GENERAL',
	assignmentType: null,
	createdAt: '2026-11-20T09:00:00+09:00',
	readMemberCount: 0,
};

export const homeSessionItem: CurrentWeekSessionResponse & { lateParticipationDeadline: string } = {
	id: 1,
	week: 6,
	name: '정기 세션과 팀별 진행 상황 공유',
	place: '디프만 세미나실',
	isOnline: false,
	date: at('14:00'),
	attendanceStart: HOME_CLOCK.attendanceOpen,
	lateStart: HOME_CLOCK.lateOpen,
	absentStart: HOME_CLOCK.lateParticipation,
	lateParticipationDeadline: HOME_CLOCK.deadline,
	attendanceCode: '',
	canRecordAttendance: true,
};

export const homeSession: NextSessionHomeResponse = {
	status: 'AVAILABLE',
	cohortValue: '17',
	session: homeSessionItem,
};

export const homePendingFeedback: SessionFeedbackPending = {
	sessionId: 2,
	week: 5,
	sessionName: '팀별 중간 발표',
	endAt: '2026-11-30T23:59:59+09:00',
};

export const makeAttendance = (
	status: AttendanceStatus,
	{
		attendedAt = null,
		canRegisterLateParticipation = false,
	}: {
		attendedAt?: string | null;
		canRegisterLateParticipation?: boolean;
	} = {},
): MyAttendanceBySessionIdResponse => ({
	attendance: { status, attendedAt, canRegisterLateParticipation },
	session: {
		week: homeSessionItem.week,
		eventName: homeSessionItem.name,
		date: homeSessionItem.date,
		place: homeSessionItem.place,
	},
});

export const makeAbsenceReason = (status: AbsenceReasonStatus): MyAbsenceReasonResponse => ({
	status,
	contents: '개인 일정으로 세션에 참석하기 어려워요.',
	images: [],
	imageIds: [],
	createdAt: at('09:00'),
	updatedAt: status === 'PENDING' ? null : at('11:00'),
});

export const homeSessionFeedback: SessionFeedbackPending = {
	sessionId: homeSessionItem.id,
	week: homeSessionItem.week,
	sessionName: homeSessionItem.name,
	endAt: '2026-11-29T23:59:59+09:00',
};

export const homeResponse = <T>(data: T): ApiResponse<T> => ({
	status: 'OK',
	code: 'SUCCESS',
	message: '',
	data,
});
