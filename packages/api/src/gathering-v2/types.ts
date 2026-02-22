import type { Part } from '../member';

/**
 * 회식 참여 조사 목록 아이템
 */
export interface GatheringV2Item {
	gatheringId: number;
	title: string;
	isOwner: boolean;
	/** true=참석, false=불참, null=미제출 */
	rsvpStatus: boolean | null;
	isAttended: boolean | null;
	isApproved: boolean;
	description: string;
	scheduledAt: string;
	closedAt: string;
	isRsvpGoingCount: number;
	isAttendedCount: number;
	inviteeCount: number;
	createdAt: string;
}

/**
 * 회식 초대 태그
 */
export interface GatheringV2InviteTag {
	cohortId: number;
	authorityId: number;
	tagName: string;
}

/**
 * 회식 참여 조사 상세
 */
export interface GatheringV2Detail {
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
		inviteTags: GatheringV2InviteTag[];
	};
}

/**
 * 회식 참여 여부 제출 요청
 */
export interface SubmitRsvpStatusRequest {
	isRsvpGoing: boolean;
}

/**
 * 회식 초대자 목록 멤버
 */
export interface GatheringV2RsvpMember {
	memberId: number;
	name: string;
	part: Part;
	team: number;
	isRsvpGoing: boolean;
}
