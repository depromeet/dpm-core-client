import type { Part } from '../member';

/**
 * 회식 API datetime 형식
 * - 응답: UTC 기준 "YYYY-MM-DDTHH:mm:ss.SSS" (Z 접미사 없음)
 * - 요청: ISO 8601 "YYYY-MM-DDTHH:mm:ss.SSSZ"
 */
export type AfterPartyDateTimeString = string;

export const AFTER_PARTY_DATETIME_FORMAT = {
	/** API 응답 형식 (UTC, Z 없음) */
	RESPONSE: 'YYYY-MM-DDTHH:mm:ss.SSS',
	/** API 요청 형식 (ISO 8601, Z 포함) */
	REQUEST: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
} as const;

export interface InviteTagItem {
	cohortId: number;
	authorityId: number;
	tagName: string;
}

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

/** getAfterPartyById 상세 조회 전용 응답 타입 */
export interface AfterPartyDetail {
	gatheringId: number;
	title: string;
	isOwner: boolean;
	rsvpStatus: boolean | null;
	isAttended: boolean | null;
	description: string;
	scheduledAt: string;
	closedAt: string;
	isRsvpGoingCount: number;
	attendanceCount: number;
	inviteeCount: number;
	authorMemberId: number;
	createdAt: string;
	isClosed: boolean;
	inviteTags: {
		inviteTags: InviteTagItem[];
	};
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

/** PATCH /v2/gatherings/{gatheringId} 수정 API 요청 */
export interface UpdateAfterPartyRequest {
	title: string;
	description: string;
	scheduledAt: string;
	closedAt: string;
	isApproved: boolean;
	authorMemberId: number;
	canEditAfterApproval: boolean;
	inviteTags: {
		cohortId: number;
		authorityId: number;
	}[];
}

export interface GetInviteTagsResponse {
	inviteTags: InviteTagItem[];
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
