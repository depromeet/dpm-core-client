'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@dpm-core/shared';

import { createSessionMutationOptions } from '@/remotes/mutations/session';
import { getCurrentWeekSessionQuery, getSessionListQuery } from '@/remotes/queries/session';

import { buildServerDatePayload, SessionForm, type SessionSchema } from './SessionForm';

export const CreateSessionContainer = () => {
	const queryClient = useQueryClient();

	const router = useRouter();
	const { mutate: createSession } = useMutation(
		createSessionMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				toast.success('세션을 추가하였습니다.');
				router.replace('/session');
			},
			onError: () => {
				toast.error('세션 추가에 실패하였습니다.');
			},
		}),
	);

	const handleCreateSession = async (formData: SessionSchema) => {
		const params = buildServerDatePayload(formData);

		createSession(params);
	};

	return <SessionForm onSubmit={handleCreateSession} />;
};
