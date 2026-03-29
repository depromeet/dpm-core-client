import type { Cohort } from '../cohort';

export type Part = 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER' | 'ETC';

export type MemberStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';

/** /v1/members/overview API 응답의 파트 (UNASSIGNED = 미배정) */
export type MemberOverviewPart = 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER' | 'UNASSIGNED';

export interface MemberOverviewItem {
	memberId: number;
	cohortId: number;
	name: string;
	email?: string;
	teamNumber: number;
	isAdmin: boolean;
	status: MemberStatus;
	part: MemberOverviewPart;
}

/** Client - PATCH /v1/members/whitelist (signup 승인) */
export interface ApproveWhitelistForSignupRequest {
	signupEmail: string;
	name: string;
}

/** Admin - PATCH /v1/members/whitelist (멤버 일괄 승인) */
export interface ApproveWhitelistRequest {
	members: number[];
}

export interface ApproveWhitelistResponse {
	status: string;
	message: string;
	code: string;
	data: string;
}

export interface MembersOverviewResponse {
	members: MemberOverviewItem[];
}

/** PATCH /v1/members/init 요청 - 멤버 파트/팀/상태 수정 */
export type UpdateMembersInitPart = Exclude<Part, 'ETC'> | 'UNASSIGNED';

export interface UpdateMembersInitItem {
	memberId: string;
	memberPart: UpdateMembersInitPart;
	teamId: number;
	status: MemberStatus;
}

export interface UpdateMembersInitRequest {
	members: UpdateMembersInitItem[];
}

export interface UpdateMembersInitResponse {
	status: string;
	message: string;
	code: string;
	data: string;
}

export interface Member {
	email: string;
	name: string;
	cohort: Cohort;
	part: Part;
	teamNumber: number;
	isAdmin: boolean;
	status: MemberStatus;
}
