'use client';

import { useRouter } from 'next/navigation';
import { type PropsWithChildren, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@dpm-core/shared';

import { Pressable } from '@/components/motion';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { clearLastLoginMethod } from '@/lib/last-login';
import { deleteToken } from '@/lib/utils';
import { useClarity } from '@/providers/client-clarity-adapter';
import { withdrawMutationOptions } from '@/remotes/mutations/member';

/** 가입 신청 취소는 현재 계정 탈퇴와 같은 처리를 한다. */
const CancelApplicationModal = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const queryClient = useQueryClient();
	const { track } = useClarity();

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleOpenChange = (open: boolean) => {
		if (open) track(CLARITY_ACTION_ID.PENDING.CANCEL_APPLICATION_OPEN);
		setIsOpen(open);
	};

	// 취소가 끝나면 캐시를 비우고 비회원이 되므로, 상태가 바뀌기 전에 기록한다.
	const handleConfirm = () => {
		track(CLARITY_ACTION_ID.PENDING.CANCEL_APPLICATION_CONFIRM);
		withdrawMutate();
	};

	const { mutate: withdrawMutate, isPending } = useMutation(
		withdrawMutationOptions({
			onSuccess: () => {
				queryClient.clear();
				deleteToken();
				clearLastLoginMethod();
				handleClose();
				router.replace('/login');
			},
		}),
	);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				className="max-w-[min(343px,calc(100%-2rem))] gap-5 rounded-[20px] p-5 sm:max-w-[343px]"
			>
				<DialogHeader className="text-left">
					<DialogTitle className="font-bold text-title1 tracking-[-0.2px]">
						가입 신청을 취소하시겠어요?
					</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<Pressable
						className="flex-1"
						disabled={isPending}
						variant="assistive"
						size="lg"
						onClick={handleClose}
					>
						아니요
					</Pressable>
					<Pressable
						className="flex-1"
						disabled={isPending}
						variant="secondary"
						size="lg"
						onClick={handleConfirm}
					>
						취소할래요
					</Pressable>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export { CancelApplicationModal };
