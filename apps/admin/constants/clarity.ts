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
		SUMMARY_CARD_CLICK: 'summary_card_click',
		FILTER_CHANGE: 'filter_change',
		// 승인·반려 (미승인 탭): row = 행 안의 버튼, bulk = 선택한 계정을 위 버튼으로 처리
		APPROVE_ROW_CLICK: 'approve_row_click',
		APPROVE_BULK_CLICK: 'approve_bulk_click',
		REJECT_ROW_CLICK: 'reject_row_click',
		REJECT_BULK_CLICK: 'reject_bulk_click',
		APPROVE_CONFIRM: 'approve_confirm',
		MERGE_APPROVE_CONFIRM: 'merge_approve_confirm', // 병합이 포함된 승인
		REJECT_CONFIRM: 'reject_confirm',
		APPROVE_FAIL: 'approve_fail',
		MERGE_REQUIRED_SHOWN: 'merge_required_shown', // 병합이 필요하다는 안내 노출
		MERGE_CONFLICT_SHOWN: 'merge_conflict_shown', // 같은 소셜 계정이라 병합 불가 안내 노출
		// 수정 (승인 완료 탭)
		EDIT_START: 'edit_start',
		EDIT_SAVE: 'edit_save',
		EDIT_CANCEL: 'edit_cancel',
		EDIT_FAIL: 'edit_fail',
		BULK_EDIT_SAVE: 'bulk_edit_save',
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
