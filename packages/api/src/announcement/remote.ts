import { http } from '../http';
import type { Announcement } from './types';

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
};
