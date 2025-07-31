import { http } from '../http';

export const bill = {
	getBiils: async () => {
		const res = await http.get('v1/bills');
		return res;
	},
};
