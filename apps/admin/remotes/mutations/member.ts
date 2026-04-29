import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type {
	InitCohortMemberParams,
	MemberStatus,
	Part,
	UpdateMemberRoleRequest,
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

export interface ApproveWhitelistParams {
	members: number[];
}

export const approveWhitelistMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof member.approveWhitelist>>,
		Error,
		ApproveWhitelistParams
	>,
) =>
	mutationOptions({
		mutationKey: ['whitelist'],
		mutationFn: (params: ApproveWhitelistParams) =>
			member.approveWhitelist({ members: params.members }),
		...options,
	});

/** PATCH /v1/roles/members/{memberId} - 멤버 역할 변경 (isAdmin: true=ORGANIZER, false=DEEPER) */
export interface UpdateMemberRoleParams {
	memberId: number;
	isAdmin: boolean;
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
				isAdmin: params.isAdmin,
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
