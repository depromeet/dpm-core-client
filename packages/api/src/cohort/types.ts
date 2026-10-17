export type Cohort = string;

export interface CohortItem {
	cohortId: number;
	cohortNumber: string;
}

export interface CohortListResponse {
	cohorts: CohortItem[];
}

export interface CreateCohortRequest {
	value: string;
}

export interface UpdateCohortRequest {
	value: string;
}

/** GET /v3/cohorts/current/teams - 현재 기수 팀 목록 */
export interface CohortTeam {
	/** 수정 API 에 전달하는 팀 ID */
	id: number;
	/** 화면에 표시하는 팀 번호 */
	number: number;
}

export interface CohortTeamListResponse {
	teams: CohortTeam[];
}
