import { queryOptions } from '@tanstack/react-query';
import { announcement } from '@dpm-core/api';

export const getAnnouncementListQuery = queryOptions({
	queryKey: ['announcement-list'],
	queryFn: announcement.getList,
});

export const getAnnouncementDetailQuery = (announcementId: number) =>
	queryOptions({
		queryKey: ['announcement-detail', announcementId],
		queryFn: () => announcement.getDetail(announcementId),
	});

export const getAnnouncementReadMembersQuery = (announcementId: number) =>
	queryOptions({
		queryKey: ['announcement-read-members', announcementId],
		queryFn: () => announcement.getReadMembers(announcementId),
	});

export const getAnnouncementAssignmentStatusQuery = (announcementId: number) =>
	queryOptions({
		queryKey: ['announcement-assignment-status', announcementId],
		queryFn: () => announcement.getAssignmentStatus(announcementId),
	});
