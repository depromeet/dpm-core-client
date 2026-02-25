import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import { afterParty } from '@dpm-core/api';

const MUTATE_KEY = 'AFTER_PARTY';

interface SubmitAttendanceStatusParams {
	isRsvpGoing: boolean;
}

type SubmitAttendanceStatusOptions = MutationOptions<
	unknown,
	Error,
	SubmitAttendanceStatusParams,
	unknown
>;

/**
 * 회식 참여 여부 제출 mutation
 */
export const submitAttendanceStatusMutationOptions = (
	gatheringId: number,
	options?: SubmitAttendanceStatusOptions,
) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, 'attendance-status', gatheringId],
		mutationFn: (params: SubmitAttendanceStatusParams) =>
			afterParty.submitAttendanceStatus(gatheringId, params),
		...options,
	});
