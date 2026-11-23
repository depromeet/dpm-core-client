import { type ClarityDynamicPageRoute, createClarityPageResolver } from '@dpm-core/shared';

import { CLARITY_PAGE_ID, type ClarityPageId } from '@/constants/clarity';

const STATIC_PAGE_ID_BY_PATHNAME: Partial<Record<string, ClarityPageId>> = {
	'/': CLARITY_PAGE_ID.HOME,
	'/login': CLARITY_PAGE_ID.LOGIN,
	'/login/email': CLARITY_PAGE_ID.LOGIN_EMAIL,
	'/auth': CLARITY_PAGE_ID.AUTH,
	'/profile': CLARITY_PAGE_ID.PROFILE,
	'/pending': CLARITY_PAGE_ID.PENDING,
	'/pending/edit': CLARITY_PAGE_ID.PENDING_EDIT,
	'/rejected': CLARITY_PAGE_ID.REJECTED,
	'/rejected/edit': CLARITY_PAGE_ID.REJECTED_EDIT,
	'/welcome': CLARITY_PAGE_ID.WELCOME,
	'/session': CLARITY_PAGE_ID.SESSION,
	'/announcement': CLARITY_PAGE_ID.ANNOUNCEMENT,
	'/my-page': CLARITY_PAGE_ID.MY_PAGE,
	'/attendance/me': CLARITY_PAGE_ID.ATTENDANCE_ME,
};

const DYNAMIC_PAGE_IDS: ReadonlyArray<ClarityDynamicPageRoute<ClarityPageId>> = [
	{ pattern: /^\/session\/[^/]+\/feedback$/, pageId: CLARITY_PAGE_ID.SESSION_FEEDBACK },
	{ pattern: /^\/session\/[^/]+$/, pageId: CLARITY_PAGE_ID.SESSION_DETAIL },
	{ pattern: /^\/announcement\/[^/]+$/, pageId: CLARITY_PAGE_ID.ANNOUNCEMENT_DETAIL },
	{ pattern: /^\/attendance\/me\/[^/]+$/, pageId: CLARITY_PAGE_ID.ATTENDANCE_ME_SESSION },
	{
		pattern: /^\/attendance\/[^/]+\/result$/,
		pageId: CLARITY_PAGE_ID.ATTENDANCE_SESSION_RESULT,
	},
	{ pattern: /^\/attendance\/[^/]+$/, pageId: CLARITY_PAGE_ID.ATTENDANCE_SESSION },
];

export const getClarityPageId = createClarityPageResolver({
	unknownPageId: CLARITY_PAGE_ID.UNKNOWN,
	staticPages: STATIC_PAGE_ID_BY_PATHNAME,
	dynamicPages: DYNAMIC_PAGE_IDS,
});
