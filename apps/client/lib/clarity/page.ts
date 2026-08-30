import { CLARITY_PAGE_ID, type ClarityPageId } from '@/constants/clarity';

/**
 * pathname을 Clarity 페이지 ID로 변환하기 위한 매핑 목록이다.
 *
 * 새 페이지 추가 규칙
 * - 파라미터가 없는 정확한 경로는 `STATIC_PAGE_ID_BY_PATHNAME`에 추가한다.
 * - `[id]`, `[sessionId]` 같은 동적 세그먼트가 있으면 `DYNAMIC_PAGE_IDS`에 추가한다.
 * - `find`는 처음 매칭된 항목을 사용한다. 여러 정규식에 매칭될 수 있는 경로라면
 *   `/after-party/:id/participants`처럼 더 긴 세부 경로를 `/after-party/:id`보다 먼저 선언한다.
 * - 매핑되지 않은 경로는 `CLARITY_PAGE_ID.UNKNOWN`으로 처리한다.
 *
 * @example
 * // 정적 경로
 * '/session/create': CLARITY_PAGE_ID.SESSION_CREATE
 *
 * @example
 * // 동적 경로
 * {
 *   pattern: /^\/session\/[^/]+\/edit$/,
 *   pageId: CLARITY_PAGE_ID.SESSION_EDIT,
 * }
 */
const STATIC_PAGE_ID_BY_PATHNAME: Partial<Record<string, ClarityPageId>> = {
	'/': CLARITY_PAGE_ID.HOME,
	'/login': CLARITY_PAGE_ID.LOGIN,
	'/login/email': CLARITY_PAGE_ID.LOGIN_EMAIL,
	'/auth': CLARITY_PAGE_ID.AUTH,
	'/session': CLARITY_PAGE_ID.SESSION,
	'/announcement': CLARITY_PAGE_ID.ANNOUNCEMENT,
	'/after-party': CLARITY_PAGE_ID.AFTER_PARTY,
	'/after-party/create': CLARITY_PAGE_ID.AFTER_PARTY_CREATE,
	'/after-party/create/complete': CLARITY_PAGE_ID.AFTER_PARTY_CREATE_COMPLETE,
	'/bills': CLARITY_PAGE_ID.BILLS,
	'/my-page': CLARITY_PAGE_ID.MY_PAGE,
	'/attendance/me': CLARITY_PAGE_ID.ATTENDANCE_ME,
	'/attendance/policy': CLARITY_PAGE_ID.ATTENDANCE_POLICY,
};

const DYNAMIC_PAGE_IDS: ReadonlyArray<{
	pattern: RegExp;
	pageId: ClarityPageId;
}> = [
	{ pattern: /^\/session\/[^/]+$/, pageId: CLARITY_PAGE_ID.SESSION_DETAIL },
	{ pattern: /^\/announcement\/[^/]+$/, pageId: CLARITY_PAGE_ID.ANNOUNCEMENT_DETAIL },
	{
		pattern: /^\/after-party\/[^/]+\/participants$/,
		pageId: CLARITY_PAGE_ID.AFTER_PARTY_PARTICIPANTS,
	},
	{
		pattern: /^\/after-party\/[^/]+\/attendees$/,
		pageId: CLARITY_PAGE_ID.AFTER_PARTY_ATTENDEES,
	},
	{
		pattern: /^\/after-party\/[^/]+\/update$/,
		pageId: CLARITY_PAGE_ID.AFTER_PARTY_UPDATE,
	},
	{ pattern: /^\/after-party\/[^/]+$/, pageId: CLARITY_PAGE_ID.AFTER_PARTY_DETAIL },
	{ pattern: /^\/bills\/[^/]+$/, pageId: CLARITY_PAGE_ID.BILLS_DETAIL },
	{ pattern: /^\/attendance\/me\/[^/]+$/, pageId: CLARITY_PAGE_ID.ATTENDANCE_ME_SESSION },
	{
		pattern: /^\/attendance\/[^/]+\/result$/,
		pageId: CLARITY_PAGE_ID.ATTENDANCE_SESSION_RESULT,
	},
	{ pattern: /^\/attendance\/[^/]+$/, pageId: CLARITY_PAGE_ID.ATTENDANCE_SESSION },
];

export const getClarityPageId = (pathname: string): ClarityPageId => {
	const normalizedPathname = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');

	const staticPageId = STATIC_PAGE_ID_BY_PATHNAME[normalizedPathname];

	if (staticPageId) return staticPageId;

	for (const { pattern, pageId } of DYNAMIC_PAGE_IDS) {
		if (pattern.test(normalizedPathname)) return pageId;
	}

	return CLARITY_PAGE_ID.UNKNOWN;
};
