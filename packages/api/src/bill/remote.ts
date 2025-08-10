import { http } from '../http';
import type { Bill, GatheringJoin } from './types';

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

	patchBillGatheringJoins: async (id: number, data: GatheringJoin[]) => {
		const res = await http.patch(`v1/bills/${id}/join`, { json: { gatheringJoins: data } });
		return res;
	},

	patchBillParticipationConfirm: async (id: number) => {
		const res = await http.patch(`v1/bills/${id}/participation-confirm`);
		return res;
	},
};
