import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type {
	ApiErrorReponse,
	ApiResponse,
	CreateAfterPartyRequest,
	CreateAfterPartyResponse,
	SendUnmarkedRsvpNotificationRequest,
	UpdateAfterPartyRequest,
} from '@dpm-core/api';
import { afterParty } from '@dpm-core/api';

type CreateAfterPartyOptions = MutationOptions<
	ApiResponse<CreateAfterPartyResponse>,
	HTTPError<ApiErrorReponse>,
	CreateAfterPartyRequest,
	unknown
>;

export const createAfterPartyOptions = (options: CreateAfterPartyOptions) =>
	mutationOptions({
		mutationKey: ['create-after-party'],
		mutationFn: (params: CreateAfterPartyRequest) => afterParty.createAfterParty(params),
		...options,
	});

type UpdateAfterPartyOptions = MutationOptions<
	ApiResponse<CreateAfterPartyResponse>,
	HTTPError<ApiErrorReponse>,
	{ afterPartyId: number; params: UpdateAfterPartyRequest },
	unknown
>;

export const updateAfterPartyOptions = (options: UpdateAfterPartyOptions) =>
	mutationOptions({
		mutationKey: ['update-after-party'],
		mutationFn: ({ afterPartyId, params }) => afterParty.updateAfterParty(afterPartyId, params),
		...options,
	});

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

type SendUnmarkedRsvpNotificationOptions = MutationOptions<
	unknown,
	Error,
	SendUnmarkedRsvpNotificationRequest,
	unknown
>;

/**
 * 회식 참여 여부 미제출자 알림 발송 mutation
 */
export const sendUnmarkedRsvpNotificationMutationOptions = (
	afterPartyId: number,
	options?: SendUnmarkedRsvpNotificationOptions,
) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, 'un-marked-rsvp-notification', afterPartyId],
		mutationFn: (params: SendUnmarkedRsvpNotificationRequest) =>
			afterParty.sendUnmarkedRsvpNotification(afterPartyId, params),
		...options,
	});

/**
 * 회식 참여 여부 제출 mutation
 */
export const submitAttendanceStatusMutationOptions = (
	afterPartyId: number,
	options?: SubmitAttendanceStatusOptions,
) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY, 'attendance-status', afterPartyId],
		mutationFn: (params: SubmitAttendanceStatusParams) =>
			afterParty.submitAttendanceStatus(afterPartyId, params),
		...options,
	});
