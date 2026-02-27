import { http } from '../http';
import type { Announcement, AnnouncementDetail } from './types';

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
};
