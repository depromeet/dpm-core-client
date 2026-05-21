import { http } from '../http';
import { setCookie } from './cookie';

interface ReissueResponse {
	token: string;
	expirationTime: number;
}

export const auth = {
	reissue: async () => {
		const res = await http.get<ReissueResponse>('v1/reissue');
		setCookie(res.data.token, res.data.expirationTime);
		return res;
	},
	login: async (params: { email: string; password: string }) => {
		const res = await http.post('login/email', { json: params });
		return res;
	},
	kakaoLogin: async (params: { accessToken: string; refreshToken: string }) => {
		// TODO: 백엔드 body 버전 배포되면 { json: params } 로 복원
		const res = await http.post('login/auth/kakao/tokens', { searchParams: params });
		return res;
	},
	logout: async () => {
		const res = await http.post('logout');
		return res;
	},
};
