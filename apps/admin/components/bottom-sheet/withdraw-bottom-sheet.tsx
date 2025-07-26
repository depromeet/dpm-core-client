'use client';

import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@dpm-core/shared';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type PropsWithChildren, useState } from 'react';
import { useAppShell } from '@/providers/app-shell-provider';
import { withdrawMutationOptions } from '@/remotes/mutations/member';
import { Pressable } from '../motion';

interface WithdrawBottomSheetProps {
	disabled?: boolean;
}

const WithdrawBottomSheet = ({
	children,
	disabled,
}: PropsWithChildren<WithdrawBottomSheetProps>) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const { ref } = useAppShell();

	const handleClose = () => {
		setIsOpen(false);
	};

	const redirectToHome = () => {
		router.replace('/login');
	};

	const { mutate: withdrawMutate, isPending: isWithdrawPending } = useMutation(
		withdrawMutationOptions({
			onSuccess: () => {
				handleClose();
				redirectToHome();
			},
		}),
	);

	const isDisabled = isWithdrawPending || disabled;

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen} container={ref.current}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent
				className="!px-2 mx-auto"
				style={{
					maxWidth: ref.current?.clientWidth ?? 'auto',
				}}
			>
				<DrawerTitle className="sr-only">탈퇴하기</DrawerTitle>
				<DrawerHeader className="!text-left !gap-y-2 items-start">
					<h3 className="text-title2 font-semibold text-label-normal">탈퇴하기</h3>
					<p className="text-body2 text-label-assistive font-medium">
						지금 디프만 코어에서 탈퇴하면 다시 가입하기 어려워요.
						<br />
						그래도 정말 탈퇴할까요?
					</p>
				</DrawerHeader>
				<DrawerFooter>
					<Pressable
						disabled={isDisabled}
						variant="secondary"
						size="lg"
						onClick={() => withdrawMutate()}
					>
						탈퇴하기
					</Pressable>
					<Pressable disabled={isDisabled} variant="assistive" size="lg" onClick={handleClose}>
						돌아가기
					</Pressable>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export { WithdrawBottomSheet };
