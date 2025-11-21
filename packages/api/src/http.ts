import Cookies from 'js-cookie';
import ky, { type KyInstance, type Options } from 'ky';
import { logger } from '@dpm-core/shared';

import { COOKIE_KEYS } from './constants';
import { createRefreshPlugin } from './plugins/create-refresh-plugin';
import type { ApiResponse } from './type';

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class Http {
	private instance: KyInstance;
	private apiUrl: URL = new URL(BASE_URL ?? '');
	constructor() {
		const instance = ky.extend({
			prefixUrl: this.apiUrl.toString(),
			credentials: 'include',
			retry: 0,
			timeout: 10000,
		});

		this.instance = instance.extend({
			hooks: {
				beforeRequest: [
					async (request) => {
						logger.api(request.method, request.url);
						const token = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
						if (token) {
							request.headers.set('Authorization', `Bearer ${token}`);
						}
					},
				],
				afterResponse: [
					async (request, _, response) => {
						logger.api(request.method, request.url, response.status);

						return response;
					},
					createRefreshPlugin({
						whitelist: ['/v1/reissue'],
						refreshUrl: `${this.apiUrl.toString()}/v1/reissue`,
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
		if (res.status === 204) return null;
		return res.json();
	};

	put = async <Response = unknown>(url: string, options?: Options) => {
		const res = await this.instance.put<ApiResponse<Response>>(url, options);
		return res.json();
	};

	patch = async <Response = unknown>(url: string, options?: Options) => {
		const res = await this.instance.patch<ApiResponse<Response>>(url, options);
		return res.text();
	};

	delete = async <Response = unknown>(url: string, options?: Options) => {
		const res = await this.instance.delete<ApiResponse<Response>>(url, options);
		return res.text();
	};
}

export const http = new Http();
