'use client';

import { useRouter } from 'next/navigation';
import { type PropsWithChildren, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@dpm-core/shared';

import { logoutMutationOptions } from '@/remotes/mutations/auth';

import { Pressable } from '../motion';

interface LogoutBottomSheetProps {
	disabled?: boolean;
}

const LogoutBottomSheet = ({ children, disabled }: PropsWithChildren<LogoutBottomSheetProps>) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleClose = () => {
		setIsOpen(false);
	};

	const redirectToLogin = () => {
		router.replace('/login');
	};

	const { mutate: logoutMutate, isPending: isLogoutPending } = useMutation(
		logoutMutationOptions({
			onSuccess: () => {
				handleClose();
				redirectToLogin();
			},
		}),
	);

	const isDisabled = isLogoutPending || disabled;

	return (
		<Drawer activeSnapPoint={1} open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="mx-auto px-2!" style={{ maxWidth: 'auto' }}>
				<DrawerTitle className="sr-only">로그아웃</DrawerTitle>
				<DrawerHeader className="items-start gap-y-2! text-left!">
					<h3 className="text-title2 font-semibold text-label-normal">로그아웃</h3>
					<p className="text-body2 font-medium text-label-assistive">정말 로그아웃할까요?</p>
				</DrawerHeader>
				<DrawerFooter>
					<Pressable
						disabled={isDisabled}
						variant="secondary"
						size="lg"
						onClick={() => logoutMutate()}
					>
						로그아웃
					</Pressable>
					<Pressable disabled={isDisabled} variant="assistive" size="lg" onClick={handleClose}>
						돌아가기
					</Pressable>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export { LogoutBottomSheet };
