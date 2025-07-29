import { http } from '../http';
import type { ApiResponse } from '../type';
import type { GetSettleListResponse } from './types';

export const settle = {
	// 정산 목록 조회
	getSettleList: async (token?: string) => {
		const res = await http.get<ApiResponse<GetSettleListResponse>>('v1/bills', {
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
		return res;
	},
};
