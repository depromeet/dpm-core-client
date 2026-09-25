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
import { deleteToken } from '@/lib/utils';
import { logoutMutationOptions } from '@/remotes/mutations/auth';

const LogoutModal = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const queryClient = useQueryClient();

	const handleClose = () => {
		setIsOpen(false);
	};

	const redirectToLogin = () => {
		router.replace('/login');
	};

	const { mutate: logoutMutate, isPending: isLogoutPending } = useMutation(
		logoutMutationOptions({
			onSuccess: () => {
				queryClient.clear();
				deleteToken();
				handleClose();
				redirectToLogin();
			},
		}),
	);

	const isDisabled = isLogoutPending;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent showCloseButton={false}>
				<DialogTitle className="sr-only">로그아웃할까요?</DialogTitle>
				<DialogHeader className="text-left font-bold text-title1">로그아웃할까요?</DialogHeader>
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
						variant="secondary"
						size="lg"
						onClick={() => logoutMutate()}
					>
						로그아웃
					</Pressable>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export { LogoutModal };
