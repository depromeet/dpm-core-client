import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import { gatheringV2 } from '@dpm-core/api';

const MUTATE_KEY = 'GATHERING_V2';

interface SubmitRsvpStatusParams {
	isRsvpGoing: boolean;
}

type SubmitRsvpStatusOptions = MutationOptions<unknown, Error, SubmitRsvpStatusParams, unknown>;

/**
 * 회식 참여 여부 제출 mutation
 */
export const submitRsvpStatusMutationOptions = (
	gatheringId: number,
	options?: SubmitRsvpStatusOptions,
) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, 'rsvp-status', gatheringId],
		mutationFn: (params: SubmitRsvpStatusParams) =>
			gatheringV2.submitRsvpStatus(gatheringId, params),
		...options,
	});
