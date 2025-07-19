import { http } from '../http';

interface ReissueResponse {
	token: string;
	expirationTime: number;
}

export const auth = {
	reissue: async () => {
		const res = await http.post<ReissueResponse>('v1/reissue');

		return res;
	},
};
