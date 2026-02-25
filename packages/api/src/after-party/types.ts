export interface AfterParty {
	gatheringId: number;
	title: string;
	isOwner: boolean;
	rsvpStatus: boolean | null;
	isAttended: boolean;
	isApproved: boolean;
	isClosed: boolean;
	description: string;
	scheduledAt: string;
	closedAt: string;
	isRsvpGoingCount: number;
	isAttendedCount: number;
	inviteeCount: number;
	createdAt: string;
}

export type GetAfterPartiesResponse = AfterParty[];

export interface CreateAfterPartyRequest {
	title: string;
	description: string;
	inviteTags: {
		cohortId: number;
		authorityId: number;
	}[];
	scheduledAt: string;
	closedAt: string;
	allowEditAfterClose: boolean;
	canEditAfterApproval: boolean;
}

export interface CreateAfterPartyResponse {
	gatheringId: string; // 회식 ID
}

export type UpdateAfterPartyRequest = CreateAfterPartyRequest;

export interface InviteTag {
	cohortId: number;
	authorityId: number;
	tagName: string;
}

export interface GetInviteTagsResponse {
	inviteTags: InviteTag[];
}
