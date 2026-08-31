import type { ClarityPageResolverConfig } from './types';

/**
 * 앱의 pathname을 Clarity 페이지 ID로 변환하는 resolver를 생성한다.
 *
 * trailing slash를 제거한 뒤 정적 경로를 먼저 확인하고 동적 경로를 선언 순서대로 확인한다.
 * 하나의 pathname이 여러 동적 패턴과 일치할 수 있으면 더 긴 세부 경로를 먼저 선언한다.
 * 모든 매핑에 실패하면 `unknownPageId`를 반환한다.
 *
 * @example
 * const getPageId = createClarityPageResolver({
 *   unknownPageId: PAGE_ID.UNKNOWN,
 *   staticPages: {
 *     '/session': PAGE_ID.SESSION,
 *   },
 *   dynamicPages: [
 *     { pattern: /^\/session\/[^/]+$/, pageId: PAGE_ID.SESSION_DETAIL },
 *   ],
 * });
 */
export const createClarityPageResolver = <PageId extends string>({
	unknownPageId,
	staticPages,
	dynamicPages,
}: ClarityPageResolverConfig<PageId>) => {
	return (pathname: string): PageId => {
		const normalizedPathname = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
		const staticPageId = staticPages[normalizedPathname];

		if (staticPageId) return staticPageId;

		for (const { pattern, pageId } of dynamicPages) {
			if (pattern.test(normalizedPathname)) return pageId;
		}

		return unknownPageId;
	};
};
