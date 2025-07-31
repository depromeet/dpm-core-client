'use client';

import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	useAppShell,
} from '@dpm-core/shared';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type PropsWithChildren, useState } from 'react';
import { logoutMutationOptions } from '@/remotes/mutations/auth';
import { Pressable } from '../motion';

interface LogoutBottomSheetProps {
	disabled?: boolean;
}

const LogoutBottomSheet = ({ children, disabled }: PropsWithChildren<LogoutBottomSheetProps>) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const { ref } = useAppShell();

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
		<Drawer activeSnapPoint={1} open={isOpen} onOpenChange={setIsOpen} container={ref.current}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent
				className="!px-2 mx-auto"
				style={{
					// FIXME: 바텀시트 위치 계산식 분리
					maxWidth: ref.current?.clientWidth ?? 'auto',
				}}
			>
				<DrawerTitle className="sr-only">로그아웃</DrawerTitle>
				<DrawerHeader className="!text-left !gap-y-2 items-start">
					<h3 className="text-title2 font-semibold text-label-normal">로그아웃</h3>
					<p className="text-body2 text-label-assistive font-medium">정말 로그아웃할까요?</p>
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
