import type { Cohort } from '../cohort';

export type Part = 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER' | 'ETC';

export type MemberStatus = 'PENDING' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';

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

export type LoginMethod = 'KAKAO' | 'APPLE' | 'EMAIL';

export interface Member {
	email: string;
	name: string;
	cohort: Cohort;
	part: Part;
	teamNumber: number;
	isAdmin: boolean;
	status: MemberStatus;
	loginMethod: LoginMethod;
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

/**
 * GET/PATCH /v3/members/me/profile 응답
 * profileCompletionRequired === true 이면 이름·파트 최초 입력이 필요하다.
 */
export interface MemberProfile {
	name: string;
	part?: Part | 'UNASSIGNED';
	profileCompletionRequired: boolean;
}

/** PATCH /v3/members/me/profile - 본인 이름과 파트 최초 입력 (완료 후 다른 값은 409) */
export interface MemberProfileUpdateRequest {
	name: string;
	part: Exclude<Part, 'ETC'>;
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

/* ------------------------------------------------------------------------- *
 * 멤버 관리 (v3)
 * 어드민 멤버 관리 화면 전용 타입. v1 overview 계열과 파트/상태 표현이 다르다.
 * ------------------------------------------------------------------------- */

/** 멤버 관리 목록의 파트. UNASSIGNED = 미배정 */
export type ManagedMemberPart = 'WEB' | 'SERVER' | 'DESIGN' | 'IOS' | 'ANDROID' | 'UNASSIGNED';

/** 멤버 타입. 내부 MASTER 권한은 응답에 노출되지 않는다. */
export type ManagedMemberType = 'DEEPER' | 'ORGANIZER' | 'CORE' | 'UNASSIGNED';

/** 멤버 관리 목록의 승인 상태 */
export type ManagedMemberStatus = 'PENDING' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';

/** 승인 탭. APPROVED 는 ACTIVE/INACTIVE 를 포함한다. */
export type MemberApprovalStatus = 'PENDING' | 'APPROVED';

/** 활동 상태 필터. NORMAL=활동 중, AT_RISK=수료 위험·불가, INACTIVE=정지·기수 종료 */
export type MemberActivityStatus = 'NORMAL' | 'AT_RISK' | 'INACTIVE';

/** 수료 상태. 미승인·기수 미소속 멤버는 null */
export type MemberGraduationStatus = 'NORMAL' | 'AT_RISK' | 'IMPOSSIBLE' | 'COMPLETED';

/** GET /v3/members/overview 요청 */
export interface MemberManagementRequest {
	approvalStatus: MemberApprovalStatus;
	/** 닉네임 또는 표시 이메일 부분 검색 */
	search?: string;
	parts?: ManagedMemberPart[];
	/** 팀 번호. 미배정은 0 */
	teamNumbers?: number[];
	activityStatuses?: MemberActivityStatus[];
	/** 운영진·코어 제외. 기본 true */
	excludeStaff: boolean;
	/** 파트·팀·타입 중 하나라도 미배정인 멤버만 조회 */
	missingInformationOnly: boolean;
	graduationStatuses?: MemberGraduationStatus[];
	/** 1부터 시작 */
	page: number;
	size: number;
}

/** 검색·필터와 무관한 현재 기수 현황 */
export interface MemberManagementTotals {
	/** 현재 기수 승인 회원 수 (가입 대기자 제외) */
	totalMemberCount: number;
	deeperCount: number;
	organizerCount: number;
	coreCount: number;
	pendingCount: number;
	missingInformationCount: number;
	/** AT_RISK + IMPOSSIBLE 합계 */
	graduationRiskCount: number;
}

export interface MemberManagementSummary {
	memberId: number;
	cohortId?: number;
	name: string;
	/** 표시 이메일. 카카오 우선, 없으면 null */
	email?: string | null;
	part: ManagedMemberPart;
	memberType: ManagedMemberType;
	/** 팀 번호. 미배정은 0 */
	teamNumber: number;
	status: ManagedMemberStatus;
	missingInformation: boolean;
	graduationStatus?: MemberGraduationStatus | null;
	/** 닉네임과 파트가 같은 다른 회원 존재 여부 */
	duplicateSuspected: boolean;
	updatedAt?: string;
}

export interface MemberManagementResponse {
	cohortId: number;
	summary: MemberManagementTotals;
	/** 검색·필터 적용 후 목록 전체 수 */
	totalElements: number;
	page: number;
	size: number;
	/** 회원 기본정보 변경/생성 시각 중 최댓값 */
	lastUpdatedAt?: string;
	members: MemberManagementSummary[];
}

/** 요약 대시보드 NEW 뱃지 카드 종류 */
export type MemberBadgeCard = 'PENDING' | 'INCOMPLETE' | 'AT_RISK';

export interface MemberBadge {
	card: MemberBadgeCard;
	/** 운영진 공통 미확인 여부 */
	hasNew: boolean;
	/** 신규 진입마다 증가. 확인 요청에 그대로 전달 */
	version: number;
}

export interface MemberBadgesResponse {
	cohortId: number;
	cards: MemberBadge[];
}

/** POST /v3/members/badges/{card}/acknowledgement */
export interface MemberBadgeAcknowledgeRequest {
	cohortId: number;
	version: number;
}

/** PATCH /v3/members/whitelist - 가입 승인 (단건도 배열로 전달) */
export interface MemberApprovalRequest {
	members: number[];
}

/** POST /v3/members/merge - 중복 계정 통합 및 승인 */
export interface MemberMergeRequest {
	/** 통합 후 유지하고 승인할 멤버 ID */
	retainedMemberId: number;
	/** 로그인 수단을 옮긴 뒤 정리할 멤버 ID */
	sourceMemberId: number;
}

/**
 * PATCH /v3/members/{memberId} - 승인 멤버 정보 수정
 * 생략하거나 null 인 컬럼은 기존 값을 유지한다. 수료 위험은 서버가 계산하므로 수정 대상이 아니다.
 */
export interface MemberManagementUpdateRequest {
	part?: ManagedMemberPart;
	/** 현재 기수 팀 ID. 0 은 미배정 (목록의 teamNumber 와 다른 값) */
	teamId?: number;
	memberType?: ManagedMemberType;
	status?: Extract<ManagedMemberStatus, 'ACTIVE' | 'INACTIVE'>;
}

/** PATCH /v3/members/bulk - changes 에는 한 컬럼만 지정한다. */
export interface MemberManagementBulkUpdateRequest {
	memberIds: number[];
	changes: MemberManagementUpdateRequest;
}

/** DELETE /v3/members/bulk */
export interface MemberBulkDeleteRequest {
	memberIds: number[];
}

/** GET /v3/members/parts */
export interface MemberPartsResponse {
	parts: ManagedMemberPart[];
}
