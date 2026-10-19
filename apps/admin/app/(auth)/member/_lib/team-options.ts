import type { CohortTeam } from '@dpm-core/api';

import { UNASSIGNED_TEAM_NUMBER } from '../_constants';

/**
 * 팀 목록 API 가 돌려주는 팀 번호를, UI 에서 쓸 수 있는 "실제 팀 번호"만 걸러낸다.
 *
 * 미배정(0)은 화면에서 우리가 직접 추가하는 고정 선택지라, 서버 데이터에 번호가
 * 0인 팀 레코드가 섞여 있으면(실제로 dev 환경에 {id:0,number:0} 같은 데이터가 있었다)
 * "미배정"이 두 번 나오거나 React key 가 겹치는 문제가 생긴다. 그래서 0번 팀은
 * 데이터 쪽 문제로 보고 걸러낸다.
 */
export function toRealTeamNumbers(teams: CohortTeam[]): number[] {
	return teams.map((team) => team.number).filter((number) => number !== UNASSIGNED_TEAM_NUMBER);
}
