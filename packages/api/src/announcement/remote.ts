import { http } from '../http';
import type { Announcement, AnnouncementDetail, ReadMembersData } from './types';

type AnnouncementListResponse = {
	announcementCount: number;
	announcements: Announcement[];
};

export const announcement = {
	/**
	 * 공지/과제 목록 조회
	 * 공지/과제 목록을 조회합니다.
	 * @returns 공지/과제 목록
	 */
	getList: async () => {
		return http.get<AnnouncementListResponse>('v1/announcements');
	},

	/**
	 * 공지/과제 상세 조회
	 * 공지/과제 상세 내용을 조회합니다.
	 * @param announcementId 공지/과제 ID
	 * @returns 공지/과제 상세
	 */
	getDetail: async (announcementId: number) => {
		return http.get<AnnouncementDetail>(`v1/announcements/${announcementId}`);
	},

	/**
	 * 멤버들 공지/과제 읽음 여부 조회
	 * 멤버 별로 공지/과제 읽음 여부를 조회합니다.
	 * @param announcementId 공지/과제 ID
	 * @returns 읽은/안 읽은 멤버 목록
	 */
	getReadMembers: async (announcementId: number) => {
		return http.get<ReadMembersData>(`v1/announcements/${announcementId}/mark-as-read/members`);
	},

	/**
	 * 과제 제출 상태 변경
	 * 과제 제출 상태를 변경합니다.
	 * @param announcementId 공지/과제 ID
	 * @param body 제출 상태 및 멤버 ID 목록
	 */
	patchAssignmentStatus: async (
		announcementId: number,
		body: { submitStatus: string; memberIds: number[] },
	) => {
		return http.patch(`v1/announcements/${announcementId}/assignment-status`, { json: body });
	},
};
