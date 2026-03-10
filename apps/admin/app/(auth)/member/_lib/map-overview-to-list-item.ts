import type { MemberOverviewItem } from '@dpm-core/api';

import type { MemberListItem } from '../_types';

/** teamName "1팀" → 1, "미배정" 또는 빈 값 → 0 */
function parseTeamNumber(teamName: string): number {
	const match = teamName.match(/\d+/);
	return match ? Number.parseInt(match[0], 10) : 0;
}

/** API UNASSIGNED → ETC */
function mapPart(part: MemberOverviewItem['part']): MemberListItem['part'] {
	return part === 'UNASSIGNED' ? 'ETC' : part;
}

export function mapMemberOverviewToListItem(item: MemberOverviewItem): MemberListItem {
	return {
		id: item.memberId,
		name: item.name,
		email: item.email,
		teamNumber: parseTeamNumber(item.teamName),
		part: mapPart(item.part),
		status: item.status,
		assignmentScore: undefined,
	};
}
