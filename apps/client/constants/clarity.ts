/**
 * @description app 하위에 있는 경로에 따른 Clarity 페이지 ID 목록
 *
 * 새 페이지를 추가할 때는 다음 두 곳을 함께 수정한다.
 * 1. 이 객체에 분석용 페이지 ID를 `snake_case`로 추가한다.
 * 2. `@/lib/clarity/page`에 pathname과 페이지 ID의 정적 또는 동적 매핑을 추가한다.
 *
 * 수집을 시작한 ID의 문자열 값은 기존 데이터와의 연속성을 위해 변경하지 않는다.
 *
 * @example
 * SESSION_CREATE: 'session_create'
 */
export const CLARITY_PAGE_ID = {
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
} as const;

type ClarityPageKey = keyof typeof CLARITY_PAGE_ID;

export type ClarityPageId = (typeof CLARITY_PAGE_ID)[ClarityPageKey];

/**
 * @description Clarity 액션 ID 목록
 *
 * 새 액션은 해당 페이지 객체 아래에 추가한다. 페이지 정보는 `track`에서 자동으로
 * 결합하므로 액션 값에는 `home_`, `login_` 같은 페이지 접두사를 넣지 않는다.
 * 수집을 시작한 액션의 문자열 값은 기존 데이터와의 연속성을 위해 변경하지 않는다.
 *
 * @example
 * HOME: {
 *   VOC_BUTTON_CLICK: 'voc_button_click',
 * },
 * LOGIN: {
 *   KAKAO_BUTTON_CLICK: 'kakao_button_click',
 * },
 */
export const CLARITY_ACTION_ID = {
	HOME: {},
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
} as const satisfies Record<Exclude<ClarityPageKey, 'UNKNOWN'>, Record<string, string>>;

type DeepValue<T> = T extends string
	? T
	: {
			[K in keyof T]: DeepValue<T[K]>;
		}[keyof T];

export type ClarityActionId = DeepValue<typeof CLARITY_ACTION_ID>;
