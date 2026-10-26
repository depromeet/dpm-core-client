import { http } from '../http';
import type { RegisterPushTokenRequest, RegisterPushTokenResponse } from './types';

export const notification = {
	registerPushToken: async (params: RegisterPushTokenRequest) => {
		return http.post<RegisterPushTokenResponse>('v1/notifications/tokens', { json: params });
	},
	/** DELETE /v1/notifications/tokens/all - 내 푸시 토큰 전체 삭제 (회원 탈퇴 시) */
	deleteAllPushTokens: async () => {
		return http.delete('v1/notifications/tokens/all');
	},
};
