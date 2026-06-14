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

/** PATCH /v1/roles/members/{memberId} - 멤버 기수별 역할 변경 */
export interface UpdateMemberRoleRequest {
	isAdmin: boolean;
	cohort: string;
}

/** PATCH /v1/members/status - 멤버 상태 변경 */
export interface UpdateMemberStatusRequest {
	memberId: string;
	memberStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE';
}

/** POST /v1/members/authority/cohort/init/{cohortId}/{memberId} - 신규 기수 참여 회원 init */
export interface InitCohortMemberParams {
	cohortId: number;
	memberId: number;
}

/**
 * GET /v1/members/apple/hidden-email - Apple 로그인 숨김 이메일 멤버 조회
 * 실제 응답은 `{ members: [...] }` 형태 (실 토큰 호출로 확인). 숨김 이메일 미사용 멤버는 빈 배열.
 * NOTE: members 원소 구조는 빈 배열만 관측되어 미확정. 현재 프로필 설정 트리거에는 사용하지 않음.
 */
export interface AppleHiddenEmailResponse {
	members: unknown[];
}

/**
 * POST /v1/members/apple/profile - Apple 로그인 멤버 프로필(이름/파트) 수정
 * Apple 초기 가입자의 이름이 식별 불가능한 id 값으로 들어오는 경우, 이름과 직군을 수정한다.
 */
export interface AppleMemberProfileUpdateRequest {
	name: string;
	part: Part;
}

/** POST /v1/members/name/hash-type/validation - 멤버 이름 해시 형식 검증 요청 */
export interface MemberNameHashValidationRequest {
	name: string;
}

/**
 * POST /v1/members/name/hash-type/validation 응답
 * isHashType === true 이면 이름이 식별 불가능한 해시(id) 형식임을 의미한다.
 */
export interface MemberNameHashValidationResponse {
	isHashType: boolean;
}

/** GET /v1/roles/members/{memberId} - 멤버 역할 조회 */
export interface MemberRoleResponse {
	memberId: number;
	roles: string[];
}

/** GET /v1/roles/members?memberIds=... - 멤버 목록 역할 조회 */
export interface MemberRoleListResponse {
	members: MemberRoleResponse[];
}
