import ky from 'ky';
import { http } from '../http';

interface ReissueResponse {
	token: string;
	expirationTime: number;
}

export const auth = {
	reissue: async () => {
		const res = await http.post<ReissueResponse>('v1/reissue');

		ky.get('v1/members/me');
		return res;
	},
};
