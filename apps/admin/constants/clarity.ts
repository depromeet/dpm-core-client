import {
	type ClarityActionIdOf,
	type ClarityPageIdOf,
	defineClarityActionIds,
	defineClarityPageIds,
} from '@dpm-core/shared';

/** admin Clarity 페이지 ID */
export const CLARITY_PAGE_ID = defineClarityPageIds({
	UNKNOWN: 'unknown',
	HOME: 'home', // 홈
	SESSION: 'session', // 세션 목록
	SESSION_DETAIL: 'session_detail', // 세션 상세
	SESSION_CREATE: 'session_create', // 세션 생성
	SESSION_MODIFY: 'session_modify', // 세션 수정
	ANNOUNCEMENT: 'announcement', // 공지 목록
	ANNOUNCEMENT_DETAIL: 'announcement_detail', // 공지 상세
	ANNOUNCEMENT_CREATE: 'announcement_create', // 공지 생성
	ANNOUNCEMENT_CREATE_PREVIEW: 'announcement_create_preview', // 공지 생성 미리보기
	ANNOUNCEMENT_EDIT: 'announcement_edit', // 공지 수정
	MEMBER: 'member', // 멤버 관리
	MY_PAGE: 'my_page', // 마이페이지
	SUPER_ADMIN: 'super_admin', // 최고 관리자
	ATTENDANCE_SEARCH: 'attendance_search', // 출석 검색
	ATTENDANCE_SEARCH_PEOPLE: 'attendance_search_people', // 사람별 출석 검색
	ATTENDANCE_SEARCH_SESSION: 'attendance_search_session', // 세션별 출석 검색
	ATTENDANCE_MEMBER: 'attendance_member', // 멤버 출석 현황
	ATTENDANCE_SESSION: 'attendance_session', // 멤버 세션 출석 상세
});

export type ClarityPageId = ClarityPageIdOf<typeof CLARITY_PAGE_ID>;

/** admin Clarity 액션 ID */
export const CLARITY_ACTION_ID = defineClarityActionIds(CLARITY_PAGE_ID, {
	HOME: {},
	SESSION: {},
	SESSION_DETAIL: {},
	SESSION_CREATE: {},
	SESSION_MODIFY: {},
	ANNOUNCEMENT: {},
	ANNOUNCEMENT_DETAIL: {},
	ANNOUNCEMENT_CREATE: {},
	ANNOUNCEMENT_CREATE_PREVIEW: {},
	ANNOUNCEMENT_EDIT: {},
	MEMBER: {
		// 미승인/승인 완료 탭은 주소가 같아 페이지 ID로 구분되지 않으므로 탭 진입을 따로 기록한다.
		TAB_PENDING_VIEW: 'tab_pending_view',
		TAB_APPROVED_VIEW: 'tab_approved_view',
		// 요약 대시보드 카드. 이벤트는 속성값을 받지 못하므로 카드별로 이름을 나눈다.
		DASHBOARD_CLICK_PENDING: 'dashboard_click_pending',
		DASHBOARD_CLICK_MISSING_INFO: 'dashboard_click_missing_info',
		DASHBOARD_CLICK_RISK: 'dashboard_click_risk',
		FILTER_CHANGE: 'filter_change',
		// 승인 (미승인 탭): *_click 은 클릭 즉시, *_success/*_fail 은 서버 응답 후
		PENDING_ROW_SELECT: 'pending_row_select',
		APPROVE_TOOLBAR_CLICK: 'approve_toolbar_click',
		APPROVE_ROW_CLICK: 'approve_row_click',
		APPROVE_MODAL_VIEW: 'approve_modal_view',
		APPROVE_MODAL_REJECT_CLICK: 'approve_modal_reject_click',
		APPROVE_MODAL_CLOSE: 'approve_modal_close', // X·바깥 클릭으로 닫힘
		APPROVE_CONFIRM: 'approve_confirm',
		APPROVE_SUCCESS: 'approve_success',
		APPROVE_FAIL: 'approve_fail',
		// 병합 후 승인
		MERGE_APPROVE_CLICK: 'merge_approve_click',
		MERGE_MODAL_VIEW: 'merge_modal_view',
		MERGE_CONFIRM: 'merge_confirm',
		MERGE_CANCEL: 'merge_cancel', // [취소]·X·바깥 클릭
		MERGE_BLOCKED_VIEW: 'merge_blocked_view', // 같은 소셜 계정이라 병합 불가 안내 노출
		MERGE_SUCCESS: 'merge_success',
		MERGE_FAIL: 'merge_fail',
		MERGE_REQUIRED_SHOWN: 'merge_required_shown', // 짝을 함께 선택하라는 안내 노출
		// 반려
		REJECT_CLICK: 'reject_click', // 행·툴바 버튼
		REJECT_CONFIRM: 'reject_confirm',
		// 수정 (승인 완료 탭)
		EDIT_MODE_ENTER: 'edit_mode_enter',
		EDIT_CANCEL: 'edit_cancel',
		EDIT_SAVE_CLICK: 'edit_save_click',
		EDIT_SAVE_SUCCESS: 'edit_save_success',
		EDIT_SAVE_FAIL: 'edit_save_fail',
		BULK_EDIT_OPEN: 'bulk_edit_open',
		BULK_EDIT_SAVE_SUCCESS: 'bulk_edit_save_success',
		// 삭제 (승인 완료 탭, 영구 삭제)
		DELETE_CLICK: 'delete_click',
		DELETE_CONFIRM: 'delete_confirm',
		DELETE_FAIL_CONFLICT: 'delete_fail_conflict', // 공지·회식·정산·모임 소유자 포함(409)
		DELETE_FAIL: 'delete_fail',
	},
	MY_PAGE: {},
	SUPER_ADMIN: {},
	ATTENDANCE_SEARCH: {},
	ATTENDANCE_SEARCH_PEOPLE: {},
	ATTENDANCE_SEARCH_SESSION: {},
	ATTENDANCE_MEMBER: {},
	ATTENDANCE_SESSION: {},
});

export type ClarityActionId = ClarityActionIdOf<typeof CLARITY_ACTION_ID>;
