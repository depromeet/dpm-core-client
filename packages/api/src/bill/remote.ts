import { http } from '../http';
import type { Bill } from './types';

interface GetBillsResponse {
	bills: Bill[];
}

type GetBillDetailByIdResponse = Bill;

export const bill = {
	getBiils: async () => {
		const res = await http.get<GetBillsResponse>('v1/bills');
		return res;
	},

	getBillDetailById: async (id: number) => {
		const res = await http.get<GetBillDetailByIdResponse>(`v1/bills/${id}`);
		return res;
	},
};
