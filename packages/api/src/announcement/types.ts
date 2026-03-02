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

export type AnnouncementType = 'NOTICE' | 'ASSIGNMENT';
export type AssignmentType = 'INDIVIDUAL' | 'TEAM' | null;

export interface Announcement {
	announcementId: number;
	title: string;
	announcementType: AnnouncementType;
	assignmentType: AssignmentType;
	createdAt: string;
	readMemberCount: number;
}

export interface AnnouncementDetail {
	title: string;
	content: string;
	createdAt: string;
	markAsReadCount: number;
	announcementType: AnnouncementType;
	assignmentType: AssignmentType;
}

export interface ReadMember {
	memberId: number;
	name: string;
	teamId: number;
	part: string;
}

export interface ReadMembersData {
	readMembers: ReadMember[];
	unreadMembers: ReadMember[];
}
