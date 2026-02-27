/** 공지 등록 API 요청 body (POST /v1/announcements) */
export interface CreateAnnouncementRequest {
	announcementType: 'GENERAL' | 'ASSIGNMENT';
	submitType?: 'INDIVIDUAL' | 'TEAM';
	title: string;
	content: string;
	submitLink?: string;
	startAt?: string; // date-time ISO
	dueAt?: string; // date-time ISO
	scheduledAt?: string; // date-time ISO
	shouldSendNotification: boolean;
}
