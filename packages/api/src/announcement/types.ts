/** 과제 관련 필드 (assignment depth) */
export interface CreateAnnouncementAssignment {
	submitType: 'INDIVIDUAL' | 'TEAM';
	submitLink?: string;
	startAt?: string; // date-time ISO
	dueAt?: string; // date-time ISO
}

/** 공지 등록 API 요청 body (POST /v1/announcements) */
export interface CreateAnnouncementRequest {
	announcementType: 'GENERAL' | 'ASSIGNMENT';
	title: string;
	content: string;
	assignment?: CreateAnnouncementAssignment;
	scheduledAt?: string; // date-time ISO
	shouldSendNotification: boolean;
}

/** 공지 수정 API 요청 body (PATCH /v1/announcements/:id) */
export type UpdateAnnouncementRequest = CreateAnnouncementRequest;

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

export interface AnnouncementDetailAssignment {
	submitType: 'INDIVIDUAL' | 'TEAM';
	startAt?: string;
	dueAt?: string;
	submitLink?: string;
}

export interface AnnouncementDetail {
	announcementId: number;
	title: string;
	content: string;
	createdAt: string;
	markAsReadCount: number;
	announcementType: AnnouncementType;
	assignment?: AnnouncementDetailAssignment;
	isRead: boolean;
	scheduledAt?: string;
	shouldSendNotification?: boolean;
	startAt?: string;
}

export type ServerSubmitStatus = 'PENDING' | 'SUBMITTED' | 'LATE_SUBMITTED' | 'NOT_SUBMITTED';

export interface ReadMember {
	memberId: number;
	name: string;
	teamId: number;
	part: string;
	submitStatus?: ServerSubmitStatus;
	score?: number;
}

export interface ReadMembersData {
	readMembers: ReadMember[];
	unreadMembers: ReadMember[];
}

export interface AssignmentStatusMember {
	memberId: number;
	name: string;
	teamId: number;
	part: string;
	submitStatus: ServerSubmitStatus;
	score?: number;
	submitLink?: string;
}

export interface AssignmentStatusData {
	members: AssignmentStatusMember[];
}
