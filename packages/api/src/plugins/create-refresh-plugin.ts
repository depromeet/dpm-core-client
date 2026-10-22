import type { AfterResponseHook } from 'ky';
import ky from 'ky';
import { logger } from '@dpm-core/shared';

import { reissueTokens } from '../auth/reissue-core';

interface RefreshPluginOptions {
	whitelist?: (string | RegExp)[];
	refreshUrl?: string;
}

export function createRefreshPlugin(options?: RefreshPluginOptions): AfterResponseHook {
	const { whitelist = [], refreshUrl = '' } = options ?? {};

	logger.debug('refresh plugin 생성됨', { refreshUrl });

	return async (request, _, response) => {
		// 토큰 만료로 인한 미인증만 재발급 대상으로 삼는다. 그 외 상태 코드(403 권한 없음,
		// 400 탈퇴 등 비즈니스 거절 포함)는 재발급해도 달라지지 않으므로 그대로 반환한다.
		if (response.status !== 401) return response;

		const shouldSkip = whitelist.some((pattern) =>
			typeof pattern === 'string' ? request.url.includes(pattern) : pattern.test(request.url),
		);
		if (shouldSkip) {
			logger.debug('whitelist에 포함된 URL, 스킵', { url: request.url });
			return response;
		}

		try {
			logger.auth('401 감지, refresh 시도', { url: request.url });
			const { token } = await reissueTokens(refreshUrl);

			request.headers.set('Authorization', `Bearer ${token}`);
			logger.debug('원본 요청 재실행', { url: request.url });
			return ky(request);
		} catch (error) {
			logger.error('refresh 실패, 원본 401 응답 반환', { url: request.url, error });
			return response;
		}
	};
}
