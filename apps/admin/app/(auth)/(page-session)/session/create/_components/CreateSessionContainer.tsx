'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { toast } from '@dpm-core/shared';

import { SessionProivder } from '@/app/(auth)/(home)/_components/session-provider';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useClarity } from '@/providers/admin-clarity-adapter';
import { createSessionMutationOptions } from '@/remotes/mutations/session';
import { invalidateMemberManagement } from '@/remotes/queries/member';
import { getCurrentWeekSessionQuery, getSessionListQuery } from '@/remotes/queries/session';

import { SessionExitConfirmModal } from '../../_components/SessionExitConfirmModal';
import { SessionSaveConfirmModal } from '../../_components/SessionSaveConfirmModal';
import { useSessionExitGuard } from '../../_components/useSessionExitGuard';
import { REGEXP_HHMM } from '../../_utils';
import { buildSessionPayload, SessionForm, type SessionSchema } from './SessionForm';

export const CreateSessionContainer = () => {
	const queryClient = useQueryClient();
	const { track } = useClarity();
	const successfulRequestsRef = useRef(new WeakSet<object>());
	const trackSessionAction = (
		action: (typeof CLARITY_ACTION_ID.SESSION_CREATE)[keyof typeof CLARITY_ACTION_ID.SESSION_CREATE],
	) => {
		try {
			track(action);
		} catch {
			// 분석 이벤트가 실패해도 세션 생성은 계속한다.
		}
	};
	const [formDataToCreate, setFormDataToCreate] = useState<SessionSchema | null>(null);
	const [isDirty, setIsDirty] = useState(false);
	const exitGuard = useSessionExitGuard(isDirty);

	const router = useRouter();
	const { mutate: createSession, isPending } = useMutation(
		createSessionMutationOptions({
			onSuccess: (_data, variables) => {
				successfulRequestsRef.current.add(variables);
				if (variables.feedbackEnabled)
					trackSessionAction(CLARITY_ACTION_ID.SESSION_CREATE.SAVE_SUCCESS);
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				invalidateMemberManagement(queryClient);
				router.replace('/session');
			},
			onError: (_error, variables) => {
				if (variables.feedbackEnabled && !successfulRequestsRef.current.has(variables)) {
					trackSessionAction(CLARITY_ACTION_ID.SESSION_CREATE.SAVE_FAIL);
				}
				toast.error('세션 추가에 실패하였습니다.');
			},
		}),
	);

	const handleCreateSession = (formData: SessionSchema) => {
		setFormDataToCreate(formData);
	};

	const handleConfirmCreateSession = () => {
		if (!formDataToCreate) return;

		if (formDataToCreate.feedbackEnabled) {
			trackSessionAction(CLARITY_ACTION_ID.SESSION_CREATE.SAVE_CLICK);
			const { date, time } = formDataToCreate.feedbackStartAt;
			if (date && REGEXP_HHMM.test(time)) {
				const start = dayjs(date)
					.hour(Number(time.slice(0, 2)))
					.minute(Number(time.slice(2, 4)));
				if (start.isValid() && start.isAfter(dayjs())) {
					trackSessionAction(CLARITY_ACTION_ID.SESSION_CREATE.FEEDBACK_START_TIME_VALID);
				}
			}
		}
		createSession(buildSessionPayload(formDataToCreate));
	};

	return (
		<SessionProivder>
			<SessionForm
				onSubmit={handleCreateSession}
				onDirtyChange={setIsDirty}
				onFeedbackEnable={() =>
					trackSessionAction(CLARITY_ACTION_ID.SESSION_CREATE.FEEDBACK_ENABLE)
				}
				showFeedbackSettings
			/>
			<SessionSaveConfirmModal
				open={formDataToCreate !== null}
				onOpenChange={(open) => {
					if (!open && !isPending) setFormDataToCreate(null);
				}}
				onSubmit={handleConfirmCreateSession}
				isPending={isPending}
			/>
			<SessionExitConfirmModal
				open={exitGuard.isExitConfirmOpen}
				onOpenChange={exitGuard.handleOpenChange}
				onExit={exitGuard.confirmExit}
			/>
		</SessionProivder>
	);
};
