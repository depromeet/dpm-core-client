import type { MemberOverviewItem } from '@dpm-core/api';

import type { MemberListItem } from '../_types';

/** API UNASSIGNED → ETC */
function mapPart(part: MemberOverviewItem['part']): MemberListItem['part'] {
	return part === 'UNASSIGNED' ? 'ETC' : part;
}

export function mapMemberOverviewToListItem(item: MemberOverviewItem): MemberListItem {
	return {
		id: item.memberId,
		name: item.name,
		email: item.email,
		teamNumber: item.teamNumber,
		part: mapPart(item.part),
		status: item.status,
		isAdmin: item.isAdmin,
		assignmentScore: undefined,
	};
}
