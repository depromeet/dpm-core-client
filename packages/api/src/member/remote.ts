import { http } from '../http';
import type { Member } from './types';

export const member = {
	getMyMemberInfo: async () => {
		const res = await http.get<Member>('v1/members/me');
		return res;
	},

	withdraw: async () => {
		const res = await http.patch('v1/members/withdraw');
		return res;
	},

	approveWhitelist: async (params: { signupEmail: string; name: string }) => {
		const res = await http.patch('v1/members/whitelist', { json: params });
		return res;
	},
};
