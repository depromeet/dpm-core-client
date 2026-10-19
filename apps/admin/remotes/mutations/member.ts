import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type {
	InitCohortMemberParams,
	MemberApprovalRequest,
	MemberBadgeAcknowledgeRequest,
	MemberBadgeCard,
	MemberBulkDeleteRequest,
	MemberManagementBulkUpdateRequest,
	MemberManagementUpdateRequest,
	MemberMergeRequest,
	MemberStatus,
	Part,
	UpdateMemberStatusRequest,
} from '@dpm-core/api';
import { member } from '@dpm-core/api';

type WithdrawMutationOptions = MutationOptions;

export interface UpdateMembersInitParams {
	members: Array<{
		memberId: number;
		memberPart: Part;
		team: string;
		status: MemberStatus;
	}>;
}

function partToApiPart(part: Part): 'UNASSIGNED' | Exclude<Part, 'ETC'> {
	return part === 'ETC' ? 'UNASSIGNED' : part;
}

export const updateMembersInitMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof member.updateMembersInit>>,
		Error,
		UpdateMembersInitParams
	>,
) =>
	mutationOptions({
		mutationKey: ['members', 'init'],
		mutationFn: (params: UpdateMembersInitParams) =>
			member.updateMembersInit({
				members: params.members.map((m) => ({
					memberId: String(m.memberId),
					memberPart: partToApiPart(m.memberPart),
					teamId: Number(m.team),
					status: m.status,
				})),
			}),
		...options,
	});

export const withdrawMutationOptions = (options: WithdrawMutationOptions) =>
	mutationOptions({
		mutationKey: ['withdraw'],
		mutationFn: async () => {
			await member.withdraw();
			return true;
		},
		...options,
	});

/** PATCH /v1/roles/members/{memberId} - 멤버 역할 변경 (isAdmin: true=ORGANIZER, false=DEEPER) */
export interface UpdateMemberRoleParams {
	memberId: number;
	isAdmin: boolean;
	/** 기수 ID가 아니라 기수명 문자열이다(예: "18"). */
	cohort: string;
}

export const updateMemberRoleMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof member.updateMemberRole>>,
		Error,
		UpdateMemberRoleParams
	>,
) =>
	mutationOptions({
		mutationKey: ['members', 'role'],
		mutationFn: (params: UpdateMemberRoleParams) =>
			member.updateMemberRole(params.memberId, {
				roleType: params.isAdmin ? 'ORGANIZER' : 'DEEPER',
				cohort: params.cohort,
			}),
		...options,
	});

/** PATCH /v1/members/status - 멤버 상태 변경 */
export const updateMemberStatusMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof member.updateMemberStatus>>,
		Error,
		UpdateMemberStatusRequest
	>,
) =>
	mutationOptions({
		mutationKey: ['members', 'status'],
		mutationFn: (params: UpdateMemberStatusRequest) => member.updateMemberStatus(params),
		...options,
	});

/** POST /v1/members/authority/cohort/init/{cohortId}/{memberId} - 신규 기수 참여 회원 init */
export const initCohortMemberMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof member.initCohortMember>>,
		Error,
		InitCohortMemberParams
	>,
) =>
	mutationOptions({
		mutationKey: ['members', 'authority', 'cohort', 'init'],
		mutationFn: (params: InitCohortMemberParams) => member.initCohortMember(params),
		...options,
	});

/** DELETE /v1/members/{memberId}/hard-delete - 멤버 하드 삭제 */
export const hardDeleteMemberMutationOptions = (
	options?: MutationOptions<Awaited<ReturnType<typeof member.hardDeleteMember>>, Error, number>,
) =>
	mutationOptions({
		mutationKey: ['members', 'hard-delete'],
		mutationFn: (memberId: number) => member.hardDeleteMember(memberId),
		...options,
	});

/* -------------------------------------------------------------------------- *
 * 멤버 관리 (v3)
 * -------------------------------------------------------------------------- */

/** PATCH /v3/members/whitelist - 가입 승인 (단건도 배열로 전달) */
export const approveMembersMutationOptions = (
	options?: MutationOptions<unknown, Error, MemberApprovalRequest>,
) =>
	mutationOptions({
		mutationKey: ['member-management', 'approve'],
		mutationFn: (params: MemberApprovalRequest) => member.approveMembers(params),
		...options,
	});

/** POST /v3/members/merge - 중복 계정 통합 및 승인 */
export const mergeMembersMutationOptions = (
	options?: MutationOptions<unknown, Error, MemberMergeRequest>,
) =>
	mutationOptions({
		mutationKey: ['member-management', 'merge'],
		mutationFn: (params: MemberMergeRequest) => member.mergeMembers(params),
		...options,
	});

/** POST /v3/members/{memberId}/rejection - 가입 반려 */
export const rejectMemberMutationOptions = (options?: MutationOptions<unknown, Error, number>) =>
	mutationOptions({
		mutationKey: ['member-management', 'reject'],
		mutationFn: (memberId: number) => member.rejectMember(memberId),
		...options,
	});

/** PATCH /v3/members/{memberId} - 승인 멤버 개별 정보 수정 */
export interface UpdateManagedMemberParams {
	memberId: number;
	changes: MemberManagementUpdateRequest;
}

export const updateManagedMemberMutationOptions = (
	options?: MutationOptions<unknown, Error, UpdateManagedMemberParams>,
) =>
	mutationOptions({
		mutationKey: ['member-management', 'update'],
		mutationFn: ({ memberId, changes }: UpdateManagedMemberParams) =>
			member.updateManagedMember(memberId, changes),
		...options,
	});

/** PATCH /v3/members/bulk - 컬럼별 일괄 수정 */
export const bulkUpdateManagedMembersMutationOptions = (
	options?: MutationOptions<unknown, Error, MemberManagementBulkUpdateRequest>,
) =>
	mutationOptions({
		mutationKey: ['member-management', 'bulk-update'],
		mutationFn: (params: MemberManagementBulkUpdateRequest) =>
			member.bulkUpdateManagedMembers(params),
		...options,
	});

/** DELETE /v3/members/bulk - 일괄 소프트 삭제 */
export const bulkDeleteMembersMutationOptions = (
	options?: MutationOptions<unknown, Error, MemberBulkDeleteRequest>,
) =>
	mutationOptions({
		mutationKey: ['member-management', 'bulk-delete'],
		mutationFn: (params: MemberBulkDeleteRequest) => member.bulkDeleteMembers(params),
		...options,
	});

/** POST /v3/members/badges/{card}/acknowledgement - 요약 카드 NEW 확인 */
export interface AcknowledgeMemberBadgeParams extends MemberBadgeAcknowledgeRequest {
	card: MemberBadgeCard;
}

export const acknowledgeMemberBadgeMutationOptions = (
	options?: MutationOptions<unknown, Error, AcknowledgeMemberBadgeParams>,
) =>
	mutationOptions({
		mutationKey: ['member-management', 'badge-ack'],
		mutationFn: ({ card, ...params }: AcknowledgeMemberBadgeParams) =>
			member.acknowledgeMemberBadge(card, params),
		...options,
	});
