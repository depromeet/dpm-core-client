import { logger } from '@dpm-core/shared';
import type { AfterResponseHook } from 'ky';

interface RefreshPluginOptions {
	whitelist?: (string | RegExp)[];
	refreshUrl?: string;
}

export function createRefreshPlugin(options?: RefreshPluginOptions): AfterResponseHook {
	let isRefreshing = false;
	let refreshPromise: Promise<void> | null = null;
	const waitQueue: (() => void)[] = [];

	const { whitelist = [], refreshUrl = '' } = options ?? {};

	logger.debug('refresh plugin 생성됨', { refreshUrl });

	return async (request, options, response) => {
		logger.debug(`refresh plugin 실행: ${response.status}`, {
			url: request.url,
		});

		// FIXME: 미인증 반환 코드 확인 후 변경
		if (response.ok || response.status < 400) {
			return response;
		}

		logger.debug('401 에러 감지', { url: request.url });

		const shouldSkip = whitelist.some((pattern) => {
			if (typeof pattern === 'string') {
				return request.url.includes(pattern);
			}
			return pattern.test(request.url);
		});

		if (shouldSkip) {
			logger.debug('whitelist에 포함된 URL, 스킵', { url: request.url });
			return response;
		}

		if (isRefreshing && refreshPromise) {
			logger.debug('이미 refresh 중, 대기열에 추가', { url: request.url });
			await refreshPromise;
		} else if (!isRefreshing) {
			logger.auth('새로운 refresh 시작', { refreshUrl });
			isRefreshing = true;

			try {
				logger.debug('fetch로 refresh 호출 시도...');
				refreshPromise = fetch(refreshUrl, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then(async (res) => {
						if (!res.ok) {
							throw new Error(`Refresh failed with status: ${res.status}`);
						}
						const data = await res.json();
						logger.auth('refresh 성공', data);
						request.headers.set('Authorization', `Bearer ${data.data.token}`);

						for (const cb of waitQueue) {
							cb();
						}
						waitQueue.length = 0;
					})
					.catch((error) => {
						logger.error('refresh 실패', error);
						for (const cb of waitQueue) {
							cb();
						}
						waitQueue.length = 0;
						throw error;
					})
					.finally(() => {
						logger.debug('refresh 완료');
						isRefreshing = false;
						refreshPromise = null;
					});

				await refreshPromise;
			} catch (error) {
				logger.error('refresh promise 에러', error);
				isRefreshing = false;
				refreshPromise = null;
				return response;
			}
		}

		logger.debug('원본 요청 재실행', { url: request.url });

		try {
			const retryResponse = await fetch(request.url, {
				method: request.method,
				headers: request.headers,
				body: request.body,
				credentials: 'include',
			});
			logger.debug('재시도 성공');
			return retryResponse;
		} catch (retryError) {
			logger.error('재시도 실패', retryError);
			return response;
		}
	};
}
