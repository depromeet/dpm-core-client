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
	SESSION_FEEDBACK: 'session_feedback', // 세션 피드백
	ANNOUNCEMENT: 'announcement', // 공지 목록
	ANNOUNCEMENT_DETAIL: 'announcement_detail', // 공지 상세
	MY_PAGE: 'my_page', // 마이페이지
	ATTENDANCE_ME: 'attendance_me', // 내 출석 현황
	ATTENDANCE_ME_SESSION: 'attendance_me_session', // 내 출석 상세
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
		VIEWED: 'viewed',
		BANNER_STATE_ACTIVE: 'banner_state_active',
		BANNER_STATE_INACTIVE: 'banner_state_inactive',
		BANNER_STATE_NO_SESSION: 'banner_state_no_session',
		ATTENDANCE_BANNER_VIEWED: 'attendance_banner_viewed',
		ATTENDANCE_BANNER_CLICKED: 'attendance_banner_clicked',
		ATTENDANCE_CODE_VIEWED: 'attendance_code_viewed',
		ATTENDANCE_CODE_SUBMITTED: 'attendance_code_submitted',
		ATTENDANCE_CODE_SUCCEEDED: 'attendance_code_succeeded',
		ATTENDANCE_CODE_SUCCEEDED_PRESENT: 'attendance_code_succeeded_present',
		ATTENDANCE_CODE_SUCCEEDED_LATE: 'attendance_code_succeeded_late',
		ATTENDANCE_CODE_SUCCEEDED_ABSENT: 'attendance_code_succeeded_absent',
		ATTENDANCE_CODE_FAILED_MISMATCH: 'attendance_code_failed_mismatch',
		ATTENDANCE_CODE_FAILED_TOO_EARLY: 'attendance_code_failed_too_early',
		ATTENDANCE_CODE_FAILED_ALREADY_RECORDED: 'attendance_code_failed_already_recorded',
		ATTENDANCE_CODE_FAILED_EXPIRED: 'attendance_code_failed_expired',
		ATTENDANCE_CODE_FAILED_FINALIZED: 'attendance_code_failed_finalized',
		ATTENDANCE_CODE_FAILED_FORBIDDEN: 'attendance_code_failed_forbidden',
		ATTENDANCE_CODE_FAILED_NETWORK: 'attendance_code_failed_network',
		ATTENDANCE_CODE_FAILED_OTHER: 'attendance_code_failed_other',
		VOC_BUTTON_CLICK: 'voc_button_click',
		GUIDE_BANNER_CLICKED: 'guide_banner_clicked',
		FEEDBACK_CARD_VIEW: 'feedback_card_view',
		FEEDBACK_BUTTON_CLICK: 'feedback_button_click',
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
	SESSION: {
		FEEDBACK_BUTTON_VIEW: 'feedback_button_view',
		FEEDBACK_BUTTON_CLICK: 'feedback_button_click',
	},
	SESSION_DETAIL: {},
	SESSION_FEEDBACK: {
		ENTRY_VIEW: 'entry_view',
		ENTRY_SOURCE_HOME: 'entry_source_home',
		ENTRY_SOURCE_SESSION: 'entry_source_session',
		ENTRY_SOURCE_SHARED: 'entry_source_shared',
		ENTRY_SOURCE_UNKNOWN: 'entry_source_unknown',
		AVAILABLE_VIEW: 'available_view',
		SATISFACTION_VIEW: 'satisfaction_view',
		POSITIVE_VIEW: 'positive_view',
		IMPROVEMENT_VIEW: 'improvement_view',
		COMMENT_VIEW: 'comment_view',
		SUBMIT_CLICK: 'submit_click',
		SUBMIT_SUCCESS: 'submit_success',
		SUBMIT_FAIL: 'submit_fail',
		EXIT_CONFIRM: 'exit_confirm',
		ATTENDANCE_INCOMPLETE_VIEW: 'attendance_incomplete_view',
		NOT_TARGET_VIEW: 'not_target_view',
		BEFORE_START_VIEW: 'before_start_view',
		EXPIRED_VIEW: 'expired_view',
		SUBMITTED_VIEW: 'submitted_view',
		LOAD_FAIL: 'load_fail',
	},
	ANNOUNCEMENT: {},
	ANNOUNCEMENT_DETAIL: {},
	MY_PAGE: {
		LOGOUT_CONFIRM: 'logout_confirm',
		WITHDRAW_OPEN: 'withdraw_open',
		WITHDRAW_CONFIRM: 'withdraw_confirm',
		ACCOUNT_LINK_CLICK: 'account_link_click',
		ACCOUNT_UNLINK_CONFIRM: 'account_unlink_confirm',
	},
	ATTENDANCE_ME: {
		POLICY_BUTTON_CLICK: 'policy_button_click',
	},
	ATTENDANCE_ME_SESSION: {},
	ATTENDANCE_SESSION: {},
	ATTENDANCE_SESSION_RESULT: {},
});

export type ClarityActionId = ClarityActionIdOf<typeof CLARITY_ACTION_ID>;
