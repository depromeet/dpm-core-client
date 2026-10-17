import type {
	ManagedMemberStatus,
	MemberActivityStatus,
	MemberManagementSummary,
} from '@dpm-core/api';

import type { MemberRow } from '../_types';

/**
 * 테이블에 보여줄 활동 상태를 계산한다.
 * 서버는 승인 상태(status)와 수료 상태(graduationStatus)를 따로 주지만
 * 화면에서는 한 컬럼에 합쳐 보여준다.
 */
function toActivityStatus(
	status: ManagedMemberStatus,
	graduationStatus: MemberManagementSummary['graduationStatus'],
): MemberActivityStatus {
	if (status === 'INACTIVE') return 'INACTIVE';
	if (graduationStatus === 'AT_RISK' || graduationStatus === 'IMPOSSIBLE') return 'AT_RISK';
	return 'NORMAL';
}

export function mapMemberRow(member: MemberManagementSummary): MemberRow {
	const activityStatus = toActivityStatus(member.status, member.graduationStatus);

	return {
		id: member.memberId,
		name: member.name,
		email: member.email ?? null,
		part: member.part,
		memberType: member.memberType,
		teamNumber: member.teamNumber,
		status: member.status,
		activityStatus,
		isGraduationRisk: activityStatus === 'AT_RISK',
		duplicateSuspected: member.duplicateSuspected,
		missingInformation: member.missingInformation,
	};
}
