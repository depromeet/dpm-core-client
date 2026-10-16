import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@dpm-core/shared';

import { modifySessionMutationOptions } from '@/remotes/mutations/session';
import {
	getCurrentWeekSessionQuery,
	getSessionDetailQuery,
	getSessionListQuery,
} from '@/remotes/queries/session';

import { SessionSaveConfirmModal } from '../../../_components/SessionSaveConfirmModal';
import { buildSessionPayload, type SessionSchema } from '../../../create/_components/SessionForm';

interface SessionModifyConfirmModalProps {
	sessionId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: SessionSchema;
}

export const SessionModifyConfirmModal = ({
	formData,
	sessionId,
	open,
	onOpenChange,
}: SessionModifyConfirmModalProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutate: modifySession, isPending } = useMutation(
		modifySessionMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				queryClient.invalidateQueries(getSessionDetailQuery(sessionId));
				toast.success('세션을 수정했습니다.');
				onOpenChange(false);
				router.replace('/session');
			},
			onError: () => {
				toast.error('세션 수정에 실패했습니다.');
			},
		}),
	);

	const handleModifySession = () => {
		modifySession({
			sessionId,
			...buildSessionPayload(formData),
		});
	};

	return (
		<SessionSaveConfirmModal
			open={open}
			onOpenChange={onOpenChange}
			onSubmit={handleModifySession}
			title="세션 정보를 수정할까요?"
			isPending={isPending}
		/>
	);
};
