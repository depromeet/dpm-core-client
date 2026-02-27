import { http } from '../http';

import type { CreateAnnouncementRequest } from './types';

export const announcement = {
	/**
	 * 공지 등록
	 * @param body 공지 등록 요청 body
	 */
	create: async (body: CreateAnnouncementRequest) => {
		const res = await http.post('v1/announcements', { json: body });
		return res;
	},
};
