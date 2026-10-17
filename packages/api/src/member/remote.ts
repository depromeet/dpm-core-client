import { http } from '../http';
import type {
	AppleHiddenEmailResponse,
	AppleMemberProfileUpdateRequest,
	ApproveWhitelistForSignupRequest,
	ApproveWhitelistRequest,
	ApproveWhitelistResponse,
	InitCohortMemberParams,
	Member,
	MemberApprovalRequest,
	MemberBadgeAcknowledgeRequest,
	MemberBadgeCard,
	MemberBadgesResponse,
	MemberBulkDeleteRequest,
	MemberManagementBulkUpdateRequest,
	MemberManagementRequest,
	MemberManagementResponse,
	MemberManagementUpdateRequest,
	MemberMergeRequest,
	MemberNameHashValidationRequest,
	MemberNameHashValidationResponse,
	MemberPartsResponse,
	MemberProfile,
	MemberProfileUpdateRequest,
	MemberRoleListResponse,
	MemberRoleResponse,
	MembersOverviewResponse,
	UpdateMemberRoleRequest,
	UpdateMemberStatusRequest,
	UpdateMembersInitRequest,
	UpdateMembersInitResponse,
} from './types';

/**
 * 배열 필터는 같은 키를 반복해서 전달한다 (parts=WEB&parts=IOS).
 * 빈 배열·undefined 는 필터 미적용이므로 아예 보내지 않는다.
 */
function toMemberManagementSearchParams(params: MemberManagementRequest) {
	const searchParams = new URLSearchParams();

	searchParams.set('approvalStatus', params.approvalStatus);
	searchParams.set('excludeStaff', String(params.excludeStaff));
	searchParams.set('missingInformationOnly', String(params.missingInformationOnly));
	searchParams.set('page', String(params.page));
	searchParams.set('size', String(params.size));

	const search = params.search?.trim();
	if (search) searchParams.set('search', search);

	for (const part of params.parts ?? []) searchParams.append('parts', part);
	for (const teamNumber of params.teamNumbers ?? [])
		searchParams.append('teamNumbers', String(teamNumber));
	for (const status of params.activityStatuses ?? [])
		searchParams.append('activityStatuses', status);
	for (const status of params.graduationStatuses ?? [])
		searchParams.append('graduationStatuses', status);

	return searchParams;
}

export const member = {
	getMyMemberInfo: async () => {
		// v1/members/me 는 서버에서 제거되어 v3 로 이전됨 (출석 집계 필드가 추가됨)
		const res = await http.get<Member>('v3/members/me');
		return res;
	},

	/** GET /v3/members/me/profile - 본인 프로필 입력 상태 조회 */
	getMyProfile: async () => {
		const res = await http.get<MemberProfile>('v3/members/me/profile');
		return res;
	},

	/** PATCH /v3/members/me/profile - 본인 이름과 파트 최초 입력 */
	updateMyProfile: async (params: MemberProfileUpdateRequest) => {
		const res = await http.patch<MemberProfile>('v3/members/me/profile', { json: params });
		return res;
	},

	/** GET /v1/members/overview - latest 파라미터 (이번 기수만 보기, false면 미전송) */
	getMembersOverview: async (params?: { latest?: boolean }) => {
		const searchParams = params?.latest === true ? { latest: 'true' } : undefined;
		const res = await http.get<MembersOverviewResponse>('v1/members/overview', {
			searchParams,
		});
		return res;
	},

	withdraw: async () => {
		const res = await http.patch('v1/members/withdraw');
		return res;
	},

	/** PATCH /v1/members/init - 멤버 파트/팀/상태 수정 */
	updateMembersInit: async (params: UpdateMembersInitRequest) => {
		const res = await http.patch<UpdateMembersInitResponse>('v1/members/init', {
			json: params,
		});
		return res;
	},

	/** PATCH /v1/members/whitelist - Client signup 승인 */
	approveWhitelistForSignup: async (params: ApproveWhitelistForSignupRequest) => {
		const res = await http.patch<ApproveWhitelistResponse>('v1/members/whitelist', {
			json: params,
		});
		return res;
	},

	/** PATCH /v1/members/whitelist - Admin 멤버 일괄 승인 */
	approveWhitelist: async (params: ApproveWhitelistRequest) => {
		const res = await http.patch<ApproveWhitelistResponse>('v1/members/whitelist', {
			json: params,
		});
		return res;
	},

	/** GET /v1/roles/members/{memberId} - 멤버 기수별 역할 목록 조회 */
	getMemberRoles: async (memberId: number) => {
		const res = await http.get<MemberRoleResponse>(`v1/roles/members/${memberId}`);
		return res;
	},

	/** GET /v1/roles/members?memberIds=... - 복수 멤버 기수별 역할 목록 조회 */
	getMembersRoles: async (memberIds: number[]) => {
		const res = await http.get<MemberRoleListResponse>('v1/roles/members', {
			searchParams: { memberIds: memberIds.join(',') },
		});
		return res;
	},

	/** PATCH /v1/roles/members/{memberId} - 멤버 기수별 역할 변경 (isAdmin: true=ORGANIZER, false=DEEPER) */
	updateMemberRole: async (memberId: number, params: UpdateMemberRoleRequest) => {
		const res = await http.patch(`v1/roles/members/${memberId}`, {
			json: params,
		});
		return res;
	},

	/** PATCH /v1/members/status - 멤버 상태 변경 */
	updateMemberStatus: async (params: UpdateMemberStatusRequest) => {
		const res = await http.patch('v1/members/status', {
			json: params,
		});
		return res;
	},

	/** POST /v1/members/authority/cohort/init/{cohortId}/{memberId} - 신규 기수 참여 회원 init */
	initCohortMember: async (params: InitCohortMemberParams) => {
		const res = await http.post(
			`v1/members/authority/cohort/init/${params.cohortId}/${params.memberId}`,
		);
		return res;
	},

	/** DELETE /v1/members/{memberId}/hard-delete - 멤버 하드 삭제 */
	hardDeleteMember: async (memberId: number) => {
		const res = await http.delete(`v1/members/${memberId}/hard-delete`);
		return res;
	},

	/** GET /v1/members/apple/hidden-email - Apple 로그인 숨김 이메일 멤버 조회 */
	getAppleHiddenEmail: async () => {
		const res = await http.get<AppleHiddenEmailResponse>('v1/members/apple/hidden-email');
		return res;
	},

	/** POST /v1/members/apple/profile - Apple 로그인 멤버 프로필(이름/직군) 수정 */
	updateAppleProfile: async (params: AppleMemberProfileUpdateRequest) => {
		const res = await http.post('v1/members/apple/profile', {
			json: params,
		});
		return res;
	},

	/** POST /v1/members/name/hash-type/validation - 멤버 이름 해시(id) 형식 검증 */
	validateNameHashType: async (params: MemberNameHashValidationRequest) => {
		const res = await http.post<MemberNameHashValidationResponse>(
			'v1/members/name/hash-type/validation',
			{
				json: params,
			},
		);
		return res;
	},

	/* --------------------------------------------------------------------- *
	 * 멤버 관리 (v3)
	 * --------------------------------------------------------------------- */

	/** GET /v3/members/overview - 멤버 관리 목록 및 요약 조회 */
	getMemberManagement: async (params: MemberManagementRequest) => {
		const res = await http.get<MemberManagementResponse>('v3/members/overview', {
			searchParams: toMemberManagementSearchParams(params),
		});
		return res;
	},

	/** GET /v3/members/badges - 요약 카드 NEW 조회 */
	getMemberBadges: async () => {
		const res = await http.get<MemberBadgesResponse>('v3/members/badges');
		return res;
	},

	/** POST /v3/members/badges/{card}/acknowledgement - 요약 카드 NEW 확인 */
	acknowledgeMemberBadge: async (card: MemberBadgeCard, params: MemberBadgeAcknowledgeRequest) => {
		const res = await http.post(`v3/members/badges/${card}/acknowledgement`, { json: params });
		return res;
	},

	/** PATCH /v3/members/whitelist - 가입 대기 멤버 단건 및 일괄 승인 */
	approveMembers: async (params: MemberApprovalRequest) => {
		const res = await http.patch('v3/members/whitelist', { json: params });
		return res;
	},

	/** POST /v3/members/merge - 미승인 계정 통합 및 승인 */
	mergeMembers: async (params: MemberMergeRequest) => {
		const res = await http.post('v3/members/merge', { json: params });
		return res;
	},

	/** POST /v3/members/{memberId}/rejection - 가입 반려 */
	rejectMember: async (memberId: number) => {
		const res = await http.post(`v3/members/${memberId}/rejection`);
		return res;
	},

	/** PATCH /v3/members/{memberId} - 승인된 멤버 정보 수정 */
	updateManagedMember: async (memberId: number, params: MemberManagementUpdateRequest) => {
		const res = await http.patch(`v3/members/${memberId}`, { json: params });
		return res;
	},

	/** PATCH /v3/members/bulk - 승인된 멤버 정보 컬럼별 일괄 수정 */
	bulkUpdateManagedMembers: async (params: MemberManagementBulkUpdateRequest) => {
		const res = await http.patch('v3/members/bulk', { json: params });
		return res;
	},

	/** DELETE /v3/members/{memberId} - 멤버 소프트 삭제 */
	deleteMember: async (memberId: number) => {
		const res = await http.delete(`v3/members/${memberId}`);
		return res;
	},

	/** DELETE /v3/members/bulk - 멤버 일괄 소프트 삭제 */
	bulkDeleteMembers: async (params: MemberBulkDeleteRequest) => {
		const res = await http.delete('v3/members/bulk', { json: params });
		return res;
	},

	/** GET /v3/members/parts - 파트 선택지 조회 */
	getMemberParts: async () => {
		const res = await http.get<MemberPartsResponse>('v3/members/parts');
	/** POST /v3/members/me/reapplication - 본인 가입 재신청 (반려 회원 전용) */
	reapplyMembership: async () => {
		const res = await http.post('v3/members/me/reapplication');
		return res;
	},
};
