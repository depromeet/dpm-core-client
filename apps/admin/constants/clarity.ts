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
	MEMBER: {},
	MY_PAGE: {},
	SUPER_ADMIN: {},
	ATTENDANCE_SEARCH: {},
	ATTENDANCE_SEARCH_PEOPLE: {},
	ATTENDANCE_SEARCH_SESSION: {},
	ATTENDANCE_MEMBER: {},
	ATTENDANCE_SESSION: {},
});

export type ClarityActionId = ClarityActionIdOf<typeof CLARITY_ACTION_ID>;
