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
		const res = await http.get<GetAfterPartiesResponse>('v2/after-parties');
		return res;
	},

	getAfterPartyById: async (afterPartyId: number) => {
		const res = await http.get<AfterPartyDetail>(`v2/after-parties/${afterPartyId}`);
		return res;
	},

	getInviteTags: async () => {
		const res = await http.get<GetInviteTagsResponse>('v2/after-parties/invite-tags');
		return res;
	},

	createAfterParty: async (params: CreateAfterPartyRequest) => {
		const res = await http.post<CreateAfterPartyResponse>('v2/after-parties', { json: params });
		return res;
	},

	updateAfterParty: async (afterPartyId: number, params: UpdateAfterPartyRequest) => {
		const text = await http.patch<CreateAfterPartyResponse>(`v2/after-parties/${afterPartyId}`, {
			json: params,
		});
		if (!text || String(text).trim() === '') {
			return {
				data: { afterPartyId: String(afterPartyId) },
			} as ApiResponse<CreateAfterPartyResponse>;
		}
		return JSON.parse(String(text)) as ApiResponse<CreateAfterPartyResponse>;
	},
	/** 회식 참여 여부 제출
	 * @param afterPartyId 회식 ID
	 * @param data 참여 여부 (isRsvpGoing: true=참석, false=불참)
	 */
	submitAttendanceStatus: async (afterPartyId: number, data: SubmitAttendanceStatusRequest) => {
		const res = await http.post(`v2/after-parties/${afterPartyId}/rsvp-status`, {
			json: data,
		});
		return res;
	},

	/**
	 * 회식 초대자 목록 조회
	 * @param afterPartyId 회식 ID
	 */
	getInvitedMembers: async (afterPartyId: number) => {
		const res = await http.get<AfterPartyInvitedMember[]>(
			`v2/after-parties/${afterPartyId}/rsvp-members`,
		);
		return res;
	},
};
