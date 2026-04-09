import { http } from '../http';
import type { RegisterPushTokenRequest, RegisterPushTokenResponse } from './types';

export const notification = {
	registerPushToken: async (params: RegisterPushTokenRequest) => {
		return http.post<RegisterPushTokenResponse>('v1/notifications/tokens', { json: params });
	},
};
