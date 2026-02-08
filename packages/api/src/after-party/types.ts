export interface AfterParty {
	gatheringId: number;
	title: string;
	isOwner: boolean;
	rsvpStatus: boolean;
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
