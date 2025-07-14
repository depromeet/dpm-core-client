import { http } from '../http';

export const auth = {
	reissue: async () => {
		const res = await http.post('/v1/reissue');
		return res;
	},
};
