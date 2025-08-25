import { http } from '../http';
import type {
	Bill,
	BillAccount,
	CreateBillParams,
	FinalAmountByMember,
	GatheringJoin,
	SubmittedMember,
} from './types';

interface GetBillsResponse {
	bills: Bill[];
}

type GetBillDetailByIdResponse = Bill;

type GetBillAccountReponse = BillAccount;

interface BillSubmiitedMemberResponse {
	members: SubmittedMember[];
}

interface BillFinalAmountByMemberResponse {
	members: FinalAmountByMember[];
}

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

	getBillSubmittedMembersById: async (id: number) => {
		const res = await http.get<BillSubmiitedMemberResponse>(
			`v1/bills/${id}/members/submitted-members`,
		);
		return res;
	},

	getBillFinalAmountByMember: async (id: number) => {
		const res = await http.get<BillFinalAmountByMemberResponse>(`v1/bills/${id}/members`);
		return res;
	},

	closeBillParticipation: async ({ billId }: { billId: number }) => {
		const res = await http.patch(`v1/bills/${billId}/close-participation`);
		return res;
	},

	getBillAccountById: async (accountId: number) => {
		const res = await http.get<GetBillAccountReponse>(`v1/bills/accounts/${accountId}`);
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
