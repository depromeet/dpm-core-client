'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@dpm-core/shared';

import { SessionProivder } from '@/app/(auth)/(home)/_components/session-provider';
import { createSessionMutationOptions } from '@/remotes/mutations/session';
import { getCurrentWeekSessionQuery, getSessionListQuery } from '@/remotes/queries/session';

import { SessionExitConfirmModal } from '../../_components/SessionExitConfirmModal';
import { SessionSaveConfirmModal } from '../../_components/SessionSaveConfirmModal';
import { useSessionExitGuard } from '../../_components/useSessionExitGuard';
import { buildSessionPayload, SessionForm, type SessionSchema } from './SessionForm';

export const CreateSessionContainer = () => {
	const queryClient = useQueryClient();
	const [formDataToCreate, setFormDataToCreate] = useState<SessionSchema | null>(null);
	const [isDirty, setIsDirty] = useState(false);
	const exitGuard = useSessionExitGuard(isDirty);

	const router = useRouter();
	const { mutate: createSession, isPending } = useMutation(
		createSessionMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				router.replace('/session');
			},
			onError: () => {
				toast.error('세션 추가에 실패하였습니다.');
			},
		}),
	);

	const handleCreateSession = (formData: SessionSchema) => {
		setFormDataToCreate(formData);
	};

	const handleConfirmCreateSession = () => {
		if (!formDataToCreate) return;

		createSession(buildSessionPayload(formDataToCreate));
	};

	return (
		<SessionProivder>
			<SessionForm onSubmit={handleCreateSession} onDirtyChange={setIsDirty} showFeedbackSettings />
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
