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
	logout: async () => {
		const res = await http.post('logout');
		return res;
	},
};
