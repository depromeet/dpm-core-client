'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	toast,
} from '@dpm-core/shared';

import { deleteSessionMutationOptions } from '@/remotes/mutations/session';
import { getCurrentWeekSessionQuery, getSessionListQuery } from '@/remotes/queries/session';

interface SessionDeleteAlertProps {
	sessionId: number;
}

export const SessionDeleteAlert = (props: SessionDeleteAlertProps) => {
	const { sessionId } = props;
	const router = useRouter();

	const queryClient = useQueryClient();

	const { mutate: deleteSession, isPending: isDeleteSessionPending } = useMutation(
		deleteSessionMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				toast.success('세션 삭제에 성공했습니다.');
				router.replace('/session');
			},
			onError: () => {
				toast.error('세션 삭제에 실패했습니다.');
			},
		}),
	);

	const handleDeleteSession = () => {
		deleteSession({ sessionId });
	};

	const isDisabled = isDeleteSessionPending;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="none" size="none" className="gap-1.5">
					<Trash2 className="text-red-400" size={16} />
					삭제
				</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="sm:max-w-[425px]">
				<DialogHeader className="text-left">
					<DialogTitle>정말 삭제하시겠어요?</DialogTitle>
					<DialogDescription>삭제 후에는 복구가 불가능합니다.</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex">
					<DialogClose asChild>
						<Button variant="assistive" size="lg" className="flex-1">
							취소
						</Button>
					</DialogClose>
					<Button
						variant="none"
						className="flex-1 bg-red-400 text-label-inverse"
						size="lg"
						disabled={isDisabled}
						onClick={handleDeleteSession}
					>
						삭제하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
