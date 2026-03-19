import { http } from '../http';
import type { RegisterPushTokenRequest } from './types';

export const notification = {
	// TODO: 백엔드 API 엔드포인트 확정 후 수정 필요 (서버 명세 문서 참고)
	registerPushToken: async (params: RegisterPushTokenRequest) => {
		await http.post('v1/notifications/token', { json: params });
	},
};
