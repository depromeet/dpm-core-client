import { http } from '../http';
import type {
	Announcement,
	AnnouncementDetail,
	AssignmentStatusData,
	CreateAnnouncementRequest,
	ReadMembersData,
	UpdateAnnouncementRequest,
} from './types';

type AnnouncementListResponse = {
	announcementCount: number;
	announcements: Announcement[];
};

export const announcement = {
	/**
	 * 공지 등록
	 * @param body 공지 등록 요청 body
	 */
	create: async (body: CreateAnnouncementRequest) => {
		const res = await http.post('v1/announcements', { json: body });
		return res;
	},

	/**
	 * 공지/과제 수정
	 * @param announcementId 공지/과제 ID
	 * @param body 공지 수정 요청 body
	 */
	update: async (announcementId: number, body: UpdateAnnouncementRequest) => {
		return http.patch(`v1/announcements/${announcementId}`, { json: body });
	},

	/**
	 * 공지/과제 삭제
	 * @param announcementId 공지/과제 ID
	 */
	delete: async (announcementId: number) => {
		return http.delete(`v1/announcements/${announcementId}`);
	},

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
	 * 공지/과제 읽음 처리
	 * @param announcementId 공지/과제 ID
	 */
	markAsRead: async (announcementId: number) => {
		return http.post(`v1/announcements/${announcementId}/mark-as-read`);
	},

	/**
	 * 멤버들 과제 제출 현황 조회
	 * 멤버 별로 과제 제출 현황을 조회합니다.
	 * @param announcementId 공지/과제 ID
	 * @returns 멤버별 제출 상태 및 점수
	 */
	getAssignmentStatus: async (announcementId: number) => {
		return http.get<AssignmentStatusData>(`v1/announcements/${announcementId}/assignment-status`);
	},

	/**
	 * 과제 제출 상태 변경
	 * 과제 제출 상태를 변경합니다.
	 * @param announcementId 공지/과제 ID
	 * @param body 제출 상태 및 멤버 ID 목록
	 */
	patchAssignmentStatus: async (
		announcementId: number,
		body: { submitStatus: string; assignmentScore?: number; memberIds: number[] },
	) => {
		return http.patch(`v1/announcements/${announcementId}/assignment-status`, { json: body });
	},

	/**
	 * 공지/과제 리마인드 알림 전송
	 * 안 읽은 멤버들에게 리마인드 푸시 알림을 발송합니다.
	 * @param announcementId 공지/과제 ID
	 */
	remindNotification: async (announcementId: number) => {
		return http.post(`v1/announcements/${announcementId}/remind-notification`);
	},
};
