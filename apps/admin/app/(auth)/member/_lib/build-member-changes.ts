import type {
	CohortTeam,
	MemberActivityStatus,
	MemberManagementUpdateRequest,
} from '@dpm-core/api';

import { UNASSIGNED_TEAM_NUMBER } from '../_constants';
import type { MemberEditableFields, MemberRow } from '../_types';

/** 수정 API 는 팀 번호가 아니라 팀 ID 를 받는다. 미배정(0)은 그대로 0 을 보낸다. */
export function toTeamId(teamNumber: number, teams: CohortTeam[]): number | undefined {
	if (teamNumber === UNASSIGNED_TEAM_NUMBER) return UNASSIGNED_TEAM_NUMBER;
	return teams.find((team) => team.number === teamNumber)?.id;
}

/** 화면의 활동 상태를 수정 API 가 받는 값으로 바꾼다. 수료 위험은 보낼 수 없다. */
export function toUpdatableStatus(
	activityStatus: MemberActivityStatus,
): MemberManagementUpdateRequest['status'] {
	return activityStatus === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
}

export function toEditableFields(row: MemberRow): MemberEditableFields {
	return {
		part: row.part,
		memberType: row.memberType,
		teamNumber: row.teamNumber,
		activityStatus: row.activityStatus,
	};
}

export interface BuildMemberChangesResult {
	changes: MemberManagementUpdateRequest;
	/**
	 * 팀을 바꿨는데 팀 번호 → 팀 ID 변환에 실패했다면 true.
	 * teams 목록이 아직 로딩 전이거나 서버 데이터가 어긋난 드문 경우에 생긴다.
	 * 이 값을 무시하고 그냥 저장하면, 팀 변경만 조용히 빠진 채 "저장 완료" 토스트가 떠서
	 * 사용자는 바뀐 줄 알지만 실제로는 안 바뀐 상태가 된다. 반드시 호출하는 쪽에서 막아야 한다.
	 */
	teamLookupFailed: boolean;
}

/**
 * 바뀐 컬럼만 담은 수정 요청을 만든다.
 * 서버는 생략한 컬럼을 그대로 두므로, 건드리지 않은 값은 보내지 않는다.
 */
export function buildMemberChanges(
	row: MemberRow,
	draft: MemberEditableFields,
	teams: CohortTeam[],
): BuildMemberChangesResult {
	const changes: MemberManagementUpdateRequest = {};
	let teamLookupFailed = false;

	if (draft.part !== row.part) changes.part = draft.part;
	if (draft.memberType !== row.memberType) changes.memberType = draft.memberType;
	if (draft.teamNumber !== row.teamNumber) {
		const teamId = toTeamId(draft.teamNumber, teams);
		if (teamId === undefined) teamLookupFailed = true;
		else changes.teamId = teamId;
	}
	if (draft.activityStatus !== row.activityStatus) {
		changes.status = toUpdatableStatus(draft.activityStatus);
	}

	return { changes, teamLookupFailed };
}

export function hasChanges(changes: MemberManagementUpdateRequest): boolean {
	return Object.keys(changes).length > 0;
}
