'use client';

import { useRouter } from 'next/navigation';
import { type PropsWithChildren, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@dpm-core/shared';

import { Pressable } from '@/components/motion';
import { deleteToken } from '@/lib/utils';
import { withdrawMutationOptions } from '@/remotes/mutations/member';

const WithdrawModal = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleClose = () => {
		setIsOpen(false);
	};

	const redirectToHome = () => {
		router.replace('/login');
	};

	const { mutate: withdrawMutate, isPending: isWithdrawPending } = useMutation(
		withdrawMutationOptions({
			onSuccess: () => {
				deleteToken();
				handleClose();
				redirectToHome();
			},
		}),
	);

	const isDisabled = isWithdrawPending;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
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
						onClick={() => withdrawMutate()}
					>
						탈퇴
					</Pressable>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export { WithdrawModal };
