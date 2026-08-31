import {
	type ClarityActionIdOf,
	type ClarityPageIdOf,
	defineClarityActionIds,
	defineClarityPageIds,
} from '@dpm-core/shared';

/** client Clarity 페이지 ID */
export const CLARITY_PAGE_ID = defineClarityPageIds({
	UNKNOWN: 'unknown',
	HOME: 'home', // 홈
	LOGIN: 'login', // 로그인
	LOGIN_EMAIL: 'login_email', // 이메일 로그인
	AUTH: 'auth', // 회원 승인 대기
	SESSION: 'session', // 세션 목록
	SESSION_DETAIL: 'session_detail', // 세션 정보
	ANNOUNCEMENT: 'announcement', // 공지 목록
	ANNOUNCEMENT_DETAIL: 'announcement_detail', // 공지 상세
	AFTER_PARTY: 'after_party', // 회식 목록
	AFTER_PARTY_DETAIL: 'after_party_detail', // 회식 상세
	AFTER_PARTY_PARTICIPANTS: 'after_party_participants', // 회식 제출 현황
	AFTER_PARTY_ATTENDEES: 'after_party_attendees', // 회식 참석자
	AFTER_PARTY_UPDATE: 'after_party_update', // 회식 수정
	AFTER_PARTY_CREATE: 'after_party_create', // 회식 생성
	AFTER_PARTY_CREATE_COMPLETE: 'after_party_create_complete', // 회식 생성 완료
	BILLS: 'bills', // 정산 목록
	BILLS_DETAIL: 'bills_detail', // 정산 상세
	MY_PAGE: 'my_page', // 마이페이지
	ATTENDANCE_ME: 'attendance_me', // 내 출석 현황
	ATTENDANCE_ME_SESSION: 'attendance_me_session', // 내 출석 상세
	ATTENDANCE_POLICY: 'attendance_policy', // 출석 규정
	ATTENDANCE_SESSION: 'attendance_session', // 출석 체크
	ATTENDANCE_SESSION_RESULT: 'attendance_session_result', // 출석 체크 결과
});

export type ClarityPageId = ClarityPageIdOf<typeof CLARITY_PAGE_ID>;

/** client Clarity 액션 ID */
export const CLARITY_ACTION_ID = defineClarityActionIds(CLARITY_PAGE_ID, {
	HOME: {
		VOC_BUTTON_CLICK: 'voc_button_click',
	},
	LOGIN: {},
	LOGIN_EMAIL: {},
	AUTH: {},
	SESSION: {},
	SESSION_DETAIL: {},
	ANNOUNCEMENT: {},
	ANNOUNCEMENT_DETAIL: {},
	AFTER_PARTY: {},
	AFTER_PARTY_DETAIL: {},
	AFTER_PARTY_PARTICIPANTS: {},
	AFTER_PARTY_ATTENDEES: {},
	AFTER_PARTY_UPDATE: {},
	AFTER_PARTY_CREATE: {},
	AFTER_PARTY_CREATE_COMPLETE: {},
	BILLS: {},
	BILLS_DETAIL: {},
	MY_PAGE: {},
	ATTENDANCE_ME: {},
	ATTENDANCE_ME_SESSION: {},
	ATTENDANCE_POLICY: {},
	ATTENDANCE_SESSION: {},
	ATTENDANCE_SESSION_RESULT: {},
});

export type ClarityActionId = ClarityActionIdOf<typeof CLARITY_ACTION_ID>;
