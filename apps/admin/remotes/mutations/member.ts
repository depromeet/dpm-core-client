import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { MemberStatus, Part } from '@dpm-core/api';
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
					team: m.team,
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
