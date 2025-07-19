import { http } from '../http';
import { setCookie } from './cookie';

interface ReissueResponse {
	token: string;
	expirationTime: number;
}

export const auth = {
	reissue: async () => {
		const res = await http.post<ReissueResponse>('v1/reissue');
		setCookie(res.data.token, res.data.expirationTime);
		return res;
	},

	logout: async () => {
		const res = await http.post('v1/logout');
		return res;
	},
};
