import { http } from '../http';
import type {
	GatheringV2Detail,
	GatheringV2Item,
	GatheringV2RsvpMember,
	SubmitRsvpStatusRequest,
} from './types';

export const gatheringV2 = {
	/**
	 * 회식 참여 조사 목록 조회
	 */
	getList: async () => {
		const res = await http.get<GatheringV2Item[]>('v2/gatherings');
		return res;
	},

	/**
	 * 회식 참여 조사 상세 조회
	 * @param gatheringId 회식 ID
	 */
	getDetail: async (gatheringId: number) => {
		const res = await http.get<GatheringV2Detail>(`v2/gatherings/${gatheringId}`);
		return res;
	},

	/**
	 * 회식 참여 여부 제출
	 * @param gatheringId 회식 ID
	 * @param data 참여 여부 (isRsvpGoing: true=참석, false=불참)
	 */
	submitRsvpStatus: async (gatheringId: number, data: SubmitRsvpStatusRequest) => {
		const res = await http.post(`v2/gatherings/${gatheringId}/rsvp-status`, {
			json: data,
		});
		return res;
	},

	/**
	 * 회식 초대자 목록 조회
	 * @param gatheringId 회식 ID
	 */
	getRsvpMembers: async (gatheringId: number) => {
		const res = await http.get<GatheringV2RsvpMember[]>(
			`v2/gatherings/${gatheringId}/rsvp-members`,
		);
		return res;
	},
};
