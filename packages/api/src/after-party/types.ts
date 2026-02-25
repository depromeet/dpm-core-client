import type { Part } from '../member';

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

export interface GetAfterPartiesResponse {
	gatherings: AfterParty[];
}

/**
 * 회식 초대 태그
 */
export interface AfterPartyInviteTag {
	cohortId: number;
	authorityId: number;
	tagName: string;
}

/**
 * 회식 참여 조사 상세
 */
export interface AfterPartyDetail {
	gatheringId: number;
	title: string;
	isOwner: boolean;
	/** true=참석, false=불참, null=미제출 */
	rsvpStatus: boolean | null;
	isAttended: boolean | null;
	description: string;
	scheduledAt: string;
	closedAt: string;
	isRsvpGoingCount: number;
	inviteeCount: number;
	attendanceCount: number;
	createdAt: string;
	inviteTags: {
		inviteTags: AfterPartyInviteTag[];
	};
}

/**
 * 회식 참여 여부 제출 요청
 */
export interface SubmitAttendanceStatusRequest {
	isRsvpGoing: boolean;
}

/**
 * 회식 초대자 목록 멤버
 */
export interface AfterPartyInvitedMember {
	memberId: number;
	name: string;
	part: Part;
	team: number;
	isRsvpGoing: boolean;
}
