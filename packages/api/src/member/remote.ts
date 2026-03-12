import { http } from '../http';
import type {
	ApproveWhitelistForSignupRequest,
	ApproveWhitelistRequest,
	ApproveWhitelistResponse,
	Member,
	MembersOverviewResponse,
	UpdateMembersInitRequest,
	UpdateMembersInitResponse,
} from './types';

export const member = {
	getMyMemberInfo: async () => {
		const res = await http.get<Member>('v1/members/me');
		return res;
	},

	/** GET /v1/members/overview - currentCohortOnly 파라미터 지원 */
	getMembersOverview: async (params?: { currentCohortOnly?: boolean }) => {
		const searchParams =
			params?.currentCohortOnly != null
				? { currentCohortOnly: String(params.currentCohortOnly) }
				: undefined;
		const res = await http.get<MembersOverviewResponse>('v1/members/overview', {
			searchParams,
		});
		return res;
	},

	withdraw: async () => {
		const res = await http.patch('v1/members/withdraw');
		return res;
	},

	/** PATCH /v1/members/init - 멤버 파트/팀/상태 수정 */
	updateMembersInit: async (params: UpdateMembersInitRequest) => {
		const res = await http.patch<UpdateMembersInitResponse>('v1/members/init', {
			json: params,
		});
		return res;
	},

	/** PATCH /v1/members/whitelist - Client signup 승인 */
	approveWhitelistForSignup: async (params: ApproveWhitelistForSignupRequest) => {
		const res = await http.patch<ApproveWhitelistResponse>('v1/members/whitelist', {
			json: params,
		});
		return res;
	},

	/** PATCH /v1/members/whitelist - Admin 멤버 일괄 승인 */
	approveWhitelist: async (params: ApproveWhitelistRequest) => {
		const res = await http.patch<ApproveWhitelistResponse>('v1/members/whitelist', {
			json: params,
		});
		return res;
	},
};
