import { http } from '../http';
import type {
	CohortItem,
	CohortListResponse,
	CreateCohortRequest,
	UpdateCohortRequest,
} from './types';

export const cohort = {
	getCurrentCohort: async () => {
		const res = await http.get<{ cohortNumber: string }>('v1/cohort');
		return res;
	},

	/** GET /v1/cohorts - 전체 기수 목록 조회 */
	getList: async () => {
		const res = await http.get<CohortListResponse>('v1/cohorts');
		return res;
	},

	/** GET /v1/cohorts/latest - 최신 기수 조회 */
	getLatest: async () => {
		const res = await http.get<CohortItem>('v1/cohorts/latest');
		return res;
	},

	/** POST /v1/cohorts - 기수 생성 */
	create: async (params: CreateCohortRequest) => {
		const res = await http.post<CohortItem>('v1/cohorts', { json: params });
		return res;
	},

	/** PUT /v1/cohorts/{cohortId} - 기수 수정 */
	update: async (cohortId: number, params: UpdateCohortRequest) => {
		const res = await http.put<CohortItem>(`v1/cohorts/${cohortId}`, { json: params });
		return res;
	},

	/** DELETE /v1/cohorts/{cohortId} - 기수 삭제 */
	delete: async (cohortId: number) => {
		const res = await http.delete(`v1/cohorts/${cohortId}`);
		return res;
	},
};
