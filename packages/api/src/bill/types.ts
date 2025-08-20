export interface InviteAuthority {
	invitedAuthorityId: number;
	authorityName: string;
	authorityMemberCount: number;
}

export interface Gathering {
	gatheringId: number;
	title: string;
	description: string;
	roundNumber: number;
	heldAt: string;
	category: string;
	receipt: string | null;
	joinMemberCount: number;
	amount: number;
	splitAmount: number;
}

/**
 * 정산 상태
 * OPEN("멤버 확정 전")
 * IN_PROGRESS("정산 중")
 * COMPLETED("정산 끝")
 */
export type BillStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

export interface Bill {
	billId: number;
	title: string;
	description: string;
	billTotalAmount: number;
	billStatus: BillStatus;
	createdAt: string;
	billAccountId: number;
	invitedMemberCount: number;
	invitationConfirmedCount: number;
	invitationCheckedMemberCount: number;
	inviteAuthorities: InviteAuthority[];
	gatherings: Gathering[];
}

export interface GatheringJoin {
	gatheringId: number;
	isJoined: boolean;
}
