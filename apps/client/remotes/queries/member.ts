import { member } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

export const getMyMemberInfoQuery = queryOptions({
	queryKey: ['get-my-member-info'],
	queryFn: () => {
		return member.getMyMemberInfo();
	},
	retry: false,
	refetchInterval: false,
});
