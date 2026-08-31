import { type ClarityDynamicPageRoute, createClarityPageResolver } from '@dpm-core/shared';

import { CLARITY_PAGE_ID, type ClarityPageId } from '@/constants/clarity';

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

const DYNAMIC_PAGE_IDS: ReadonlyArray<ClarityDynamicPageRoute<ClarityPageId>> = [
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

export const getClarityPageId = createClarityPageResolver({
	unknownPageId: CLARITY_PAGE_ID.UNKNOWN,
	staticPages: STATIC_PAGE_ID_BY_PATHNAME,
	dynamicPages: DYNAMIC_PAGE_IDS,
});
