import { queryOptions } from '@tanstack/react-query';
import { member } from '@dpm-core/api';

// TODO: API 연동 시 교체
export const getPendingMemberCountQuery = queryOptions({
	queryKey: ['pending-member-count'],
	queryFn: async () => {
		// 임시: API 없음. 멤버 목록 API 연동 후 교체
		return 5;
	},
});

export const getMyMemberInfoQuery = queryOptions({
	queryKey: ['get-my-member-info'],
	queryFn: () => {
		return member.getMyMemberInfo();
	},
	retry: false,
	refetchInterval: false,
});
