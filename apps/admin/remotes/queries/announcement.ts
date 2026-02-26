import { queryOptions } from '@tanstack/react-query';
import { announcement } from '@dpm-core/api';

export const getAnnouncementListQuery = queryOptions({
	queryKey: ['announcement-list'],
	queryFn: announcement.getList,
});
