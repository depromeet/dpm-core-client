import { http } from '../http';
import type { GatheringMember } from './types';

interface GetGatheringMembersResponse {
	members: GatheringMember[];
}

export const gathering = {
	getGatheringMembers: async (params: { gatheringId: number }) => {
		const { gatheringId } = params;
		const res = await http.get<GetGatheringMembersResponse>(
			`v1/gatherings/${gatheringId}/participant-members`,
		);
		return res;
	},
};
