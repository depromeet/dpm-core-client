import { http } from '../http';
import type { ApiResponse } from '../type';
import type {
	AfterPartyDetail,
	AfterPartyInvitedMember,
	CreateAfterPartyRequest,
	CreateAfterPartyResponse,
	GetAfterPartiesResponse,
	GetInviteTagsResponse,
	SubmitAttendanceStatusRequest,
	UpdateAfterPartyRequest,
} from './types';

export const afterParty = {
	getAfterParties: async () => {
		const res = await http.get<GetAfterPartiesResponse>('v2/gatherings');
		return res;
	},

	getAfterPartyById: async (gatheringId: number) => {
		const res = await http.get<AfterPartyDetail>(`v2/gatherings/${gatheringId}`);
		return res;
	},

	getInviteTags: async () => {
		const res = await http.get<GetInviteTagsResponse>('v2/gatherings/invite-tags');
		return res;
	},

	createAfterParty: async (params: CreateAfterPartyRequest) => {
		const res = await http.post<CreateAfterPartyResponse>('v2/gatherings', { json: params });
		return res;
	},

	updateAfterParty: async (gatheringId: number, params: UpdateAfterPartyRequest) => {
		const text = await http.patch<CreateAfterPartyResponse>(`v2/gatherings/${gatheringId}`, {
			json: params,
		});
		if (!text || String(text).trim() === '') {
			return {
				data: { gatheringId: String(gatheringId) },
			} as ApiResponse<CreateAfterPartyResponse>;
		}
		return JSON.parse(String(text)) as ApiResponse<CreateAfterPartyResponse>;
	},
	/** 회식 참여 여부 제출
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
