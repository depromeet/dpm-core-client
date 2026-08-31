import type { ClarityMemberActor, CreateClarityMemberActorParams } from './types';

/** 앱의 회원 정보를 Clarity가 사용하는 공통 actor 형태로 변환한다. */
export const createClarityMemberActor = ({
	customId,
	cohort,
	isAdmin,
	status,
	friendlyName,
}: CreateClarityMemberActorParams): ClarityMemberActor => ({
	status: 'member',
	customId,
	friendlyName,
	tags: {
		user_cohort: cohort,
		user_authority: isAdmin ? 'ORGANIZER' : 'DEEPER',
		user_status: status,
	},
});
