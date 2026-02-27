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
