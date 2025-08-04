import { http } from '../http';
import type { Bill } from './types';

interface GetBillsResponse {
	bills: Bill[];
}

export const bill = {
	getBiils: async () => {
		const res = await http.get<GetBillsResponse>('v1/bills');
		return res;
	},
};
