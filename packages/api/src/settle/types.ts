export interface InviteGroup {
	inviteGroupId: number;
	groupName: string;
	groupMemberCount: number;
}

export interface Gathering {
	title: string;
	description: string;
	roundNumber: number;
	heldAt: string;
	category: string;
	receipt: string | null;
	joinMemberCount: number;
	amount: number;
}

export interface Bill {
	billId: number;
	title: string;
	description: string;
	billTotalAmount: number;
	billStatus: string;
	createdAt: string;
	billAccountId: number;
	inviteGroups: InviteGroup[];
	answerMemberCount: number;
	gatherings: Gathering[];
}

export interface GetSettleListResponse {
	bill: Bill[];
}
