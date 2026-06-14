import { http } from '../http';
import type {
	AppleHiddenEmailResponse,
	AppleMemberProfileUpdateRequest,
	ApproveWhitelistForSignupRequest,
	ApproveWhitelistRequest,
	ApproveWhitelistResponse,
	InitCohortMemberParams,
	Member,
	MemberNameHashValidationRequest,
	MemberNameHashValidationResponse,
	MemberRoleListResponse,
	MemberRoleResponse,
	MembersOverviewResponse,
	UpdateMemberRoleRequest,
	UpdateMemberStatusRequest,
	UpdateMembersInitRequest,
	UpdateMembersInitResponse,
} from './types';

export const member = {
	getMyMemberInfo: async () => {
		const res = await http.get<Member>('v1/members/me');
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
};
