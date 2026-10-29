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

const WithdrawModal = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const queryClient = useQueryClient();
	const { track } = useClarity();

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleOpenChange = (open: boolean) => {
		if (open) track(CLARITY_ACTION_ID.MY_PAGE.WITHDRAW_OPEN);
		setIsOpen(open);
	};

	// 탈퇴가 끝나면 캐시를 비우고 비회원이 되므로, 상태가 바뀌기 전에 기록한다.
	const handleConfirm = () => {
		track(CLARITY_ACTION_ID.MY_PAGE.WITHDRAW_CONFIRM);
		withdrawMutate();
	};

	const redirectToHome = () => {
		router.replace('/login');
	};

	const { mutate: withdrawMutate, isPending: isWithdrawPending } = useMutation(
		withdrawMutationOptions({
			onSuccess: () => {
				queryClient.clear();
				deleteToken();
				clearLastLoginMethod();
				handleClose();
				redirectToHome();
			},
		}),
	);

	const isDisabled = isWithdrawPending;

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent showCloseButton={false}>
				<DialogHeader className="gap-y-2 text-left">
					<DialogTitle className="sr-only">탈퇴할까요?</DialogTitle>
					<DialogHeader className="text-left font-bold text-title1">탈퇴할까요?</DialogHeader>
					<ul className="ml-4 list-disc font-medium text-body2 text-label-subtle">
						<li>계정과 이용 기록이 모두 지워져요.</li>
						<li>지운 정보는 되돌릴 수 없어요.</li>
					</ul>
				</DialogHeader>
				<DialogFooter>
					<Pressable
						className="flex-1"
						disabled={isDisabled}
						variant="assistive"
						size="lg"
						onClick={handleClose}
					>
						닫기
					</Pressable>
					<Pressable
						className="flex-1"
						disabled={isDisabled}
						variant="danger"
						size="lg"
						onClick={handleConfirm}
					>
						탈퇴
					</Pressable>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export { WithdrawModal };
