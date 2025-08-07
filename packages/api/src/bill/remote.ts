import { http } from '../http';
import type { Bill, CreateBillParams } from './types';

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

	createBill: async (json: CreateBillParams) => {
		const res = await http.post<Pick<Bill, 'billId'>>('v1/bills', { json });
		return res;
	},
};
