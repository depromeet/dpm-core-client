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
	AUTH: 'auth', // 로고 화면 (/auth)
	PROFILE: 'profile', // 가입정보 입력
	PENDING: 'pending', // 승인 대기
	PENDING_EDIT: 'pending_edit', // 승인 대기 중 개인정보 수정
	REJECTED: 'rejected', // 가입 반려 안내
	REJECTED_EDIT: 'rejected_edit', // 반려 후 개인정보 수정·재신청
	WELCOME: 'welcome', // 승인 완료 안내
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

/**
 * 가입정보 폼(ProfileForm) 액션. 폼을 쓰는 PROFILE·PENDING_EDIT·REJECTED_EDIT가 같은 값을 공유하고,
 * 실제 이벤트 이름의 앞부분은 폼이 열린 페이지 ID가 정한다. (예: profile_submit_success)
 */
export const PROFILE_FORM_ACTION = {
	SUBMIT_SUCCESS: 'submit_success',
	SUBMIT_FAIL_NAME_INVALID: 'submit_fail_name_invalid', // 이름 형식 오류(400)
	SUBMIT_FAIL_CONFLICT: 'submit_fail_conflict', // 이미 등록된 정보 변경(409)
	SUBMIT_FAIL: 'submit_fail',
} as const;

/** client Clarity 액션 ID */
export const CLARITY_ACTION_ID = defineClarityActionIds(CLARITY_PAGE_ID, {
	HOME: {
		VOC_BUTTON_CLICK: 'voc_button_click',
	},
	LOGIN: {
		KAKAO_LOGIN_CLICK: 'kakao_login_click',
		APPLE_LOGIN_CLICK: 'apple_login_click',
	},
	LOGIN_EMAIL: {
		SUBMIT_SUCCESS: 'submit_success',
		SUBMIT_FAIL: 'submit_fail',
	},
	AUTH: {},
	PROFILE: { ...PROFILE_FORM_ACTION },
	PENDING: {
		EDIT_CLICK: 'edit_click', // 개인정보 수정하기
		CANCEL_APPLICATION_OPEN: 'cancel_application_open', // 가입 신청 취소 모달 열기
		CANCEL_APPLICATION_CONFIRM: 'cancel_application_confirm', // "취소할래요" (탈퇴와 같은 처리)
	},
	PENDING_EDIT: { ...PROFILE_FORM_ACTION },
	REJECTED: {
		EDIT_CLICK: 'edit_click', // 개인정보 수정하기
	},
	REJECTED_EDIT: {
		...PROFILE_FORM_ACTION,
		REAPPLY_SUCCESS: 'reapply_success',
		REAPPLY_FAIL: 'reapply_fail',
	},
	WELCOME: {
		ENTER_CLICK: 'enter_click',
		ENTER_SUCCESS: 'enter_success',
		ENTER_FAIL: 'enter_fail',
	},
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
	MY_PAGE: {
		LOGOUT_CONFIRM: 'logout_confirm',
		WITHDRAW_OPEN: 'withdraw_open',
		WITHDRAW_CONFIRM: 'withdraw_confirm',
		ACCOUNT_LINK_CLICK: 'account_link_click',
		ACCOUNT_UNLINK_CONFIRM: 'account_unlink_confirm',
	},
	ATTENDANCE_ME: {},
	ATTENDANCE_ME_SESSION: {},
	ATTENDANCE_POLICY: {},
	ATTENDANCE_SESSION: {},
	ATTENDANCE_SESSION_RESULT: {},
});

export type ClarityActionId = ClarityActionIdOf<typeof CLARITY_ACTION_ID>;
