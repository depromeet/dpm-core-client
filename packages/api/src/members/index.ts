import { http } from '../http';

interface MyMemberInfoResponse {
	email: string;
	name: string;
}

export const getMyMemberInfo = async () => {
	const res = await http.get<MyMemberInfoResponse>('v1/members/me');
	return res;
};
