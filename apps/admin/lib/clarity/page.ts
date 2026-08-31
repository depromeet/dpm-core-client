import { type ClarityDynamicPageRoute, createClarityPageResolver } from '@dpm-core/shared';

import { CLARITY_PAGE_ID, type ClarityPageId } from '@/constants/clarity';

const STATIC_PAGE_ID_BY_PATHNAME: Partial<Record<string, ClarityPageId>> = {
	'/': CLARITY_PAGE_ID.HOME,
	'/session': CLARITY_PAGE_ID.SESSION,
	'/session/create': CLARITY_PAGE_ID.SESSION_CREATE,
	'/announcement': CLARITY_PAGE_ID.ANNOUNCEMENT,
	'/announcement/create': CLARITY_PAGE_ID.ANNOUNCEMENT_CREATE,
	'/announcement/create/preview': CLARITY_PAGE_ID.ANNOUNCEMENT_CREATE_PREVIEW,
	'/member': CLARITY_PAGE_ID.MEMBER,
	'/my-page': CLARITY_PAGE_ID.MY_PAGE,
	'/super-admin': CLARITY_PAGE_ID.SUPER_ADMIN,
	'/attendance/search': CLARITY_PAGE_ID.ATTENDANCE_SEARCH,
	'/attendance/search/people': CLARITY_PAGE_ID.ATTENDANCE_SEARCH_PEOPLE,
	'/attendance/search/session': CLARITY_PAGE_ID.ATTENDANCE_SEARCH_SESSION,
};

const DYNAMIC_PAGE_IDS: ReadonlyArray<ClarityDynamicPageRoute<ClarityPageId>> = [
	{ pattern: /^\/session\/[^/]+\/modify$/, pageId: CLARITY_PAGE_ID.SESSION_MODIFY },
	{ pattern: /^\/session\/[^/]+$/, pageId: CLARITY_PAGE_ID.SESSION_DETAIL },
	{ pattern: /^\/announcement\/[^/]+\/edit$/, pageId: CLARITY_PAGE_ID.ANNOUNCEMENT_EDIT },
	{ pattern: /^\/announcement\/[^/]+$/, pageId: CLARITY_PAGE_ID.ANNOUNCEMENT_DETAIL },
	{
		pattern: /^\/attendance\/[^/]+\/[^/]+$/,
		pageId: CLARITY_PAGE_ID.ATTENDANCE_SESSION,
	},
	{ pattern: /^\/attendance\/[^/]+$/, pageId: CLARITY_PAGE_ID.ATTENDANCE_MEMBER },
];

export const getClarityPageId = createClarityPageResolver({
	unknownPageId: CLARITY_PAGE_ID.UNKNOWN,
	staticPages: STATIC_PAGE_ID_BY_PATHNAME,
	dynamicPages: DYNAMIC_PAGE_IDS,
});
