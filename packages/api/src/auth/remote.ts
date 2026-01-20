import { http } from '../http';
import { setCookie } from './cookie';

interface ReissueResponse {
	token: string;
	expirationTime: number;
}

interface AppleLoginResponse {
	accessToken: string;
	refreshToken: string;
}

export const auth = {
	reissue: async () => {
		const res = await http.post<ReissueResponse>('v1/reissue');
		setCookie(res.data.token, res.data.expirationTime);
		return res;
	},

	logout: async () => {
		const res = await http.post('logout');
		return res;
	},

	appleLogin: async (authorizationCode: string) => {
		const res = await http.post<AppleLoginResponse>('login/auth/apple', {
			json: { authorizationCode },
		});
		return res;
	},
};
