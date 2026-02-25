import { http } from '../http';
import type {
	AfterPartyDetail,
	AfterPartyInvitedMember,
	GetAfterPartiesResponse,
	SubmitAttendanceStatusRequest,
} from './types';

export const afterParty = {
	getAfterParties: async () => {
		const res = await http.get<GetAfterPartiesResponse>('v2/gatherings');
		return res;
	},
	/**
	 * 회식 참여 조사 상세 조회
	 * @param gatheringId 회식 ID
	 */
	getDetail: async (gatheringId: number) => {
		const res = await http.get<AfterPartyDetail>(`v2/gatherings/${gatheringId}`);
		return res;
	},

	/**
	 * 회식 참여 여부 제출
	 * @param gatheringId 회식 ID
	 * @param data 참여 여부 (isRsvpGoing: true=참석, false=불참)
	 */
	submitAttendanceStatus: async (gatheringId: number, data: SubmitAttendanceStatusRequest) => {
		const res = await http.post(`v2/gatherings/${gatheringId}/rsvp-status`, {
			json: data,
		});
		return res;
	},

	/**
	 * 회식 초대자 목록 조회
	 * @param gatheringId 회식 ID
	 */
	getInvitedMembers: async (gatheringId: number) => {
		const res = await http.get<AfterPartyInvitedMember[]>(
			`v2/gatherings/${gatheringId}/rsvp-members`,
		);
		return res;
	},
};
