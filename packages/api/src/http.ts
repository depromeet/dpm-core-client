import { logger } from '@dpm-core/shared';
import ky, { type KyInstance, type Options } from 'ky';
import { createRefreshPlugin } from './plugins/create-refresh-plugin';
import type { ApiResponse } from './type';

class Http {
	private instance: KyInstance;

	constructor() {
		const instance = ky.extend({
			prefixUrl: 'https://dev.dpmcore.o-r.kr',
			credentials: 'include',
			retry: 0,
			timeout: 10000,
		});

		this.instance = instance.extend({
			hooks: {
				beforeRequest: [
					(request) => {
						logger.api(request.method, request.url);
						if (localStorage) {
							const token = localStorage.getItem('accessToken');
							if (token) {
								request.headers.set('Authorization', `Bearer ${token}`);
							}
						}
					},
				],
				afterResponse: [
					(request, options, response) => {
						logger.api(request.method, request.url, response.status);
						return response;
					},
					createRefreshPlugin({
						whitelist: ['/v1/reissue'],
						refreshUrl: 'https://dev.dpmcore.o-r.kr/v1/reissue',
					}),
				],
				beforeError: [
					(error) => {
						logger.error('HTTP 에러', error.message);
						return error;
					},
				],
			},
		});
	}

	get = async <Response = unknown>(url: string, options?: Options) => {
		const res = await this.instance.get<ApiResponse<Response>>(url, options);
		return res.json();
	};

	post = async <Response = unknown>(url: string, options?: Options) => {
		const res = await this.instance.post<ApiResponse<Response>>(url, options);
		return res.json();
	};

	put = async <Response = unknown>(url: string, options?: Options) => {
		const res = await this.instance.put<ApiResponse<Response>>(url, options);
		return res.json();
	};
}

export const http = new Http();
