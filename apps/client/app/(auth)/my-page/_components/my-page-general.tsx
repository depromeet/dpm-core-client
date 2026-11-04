'use client';

import { useIsMutating } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ChevronRight, fadeInOutVariatns } from '@dpm-core/shared';

import { Pressable } from '@/components/motion';
import { useOpenExternalUrl } from '@/hooks/use-open-external-url';
import { logoutMutationOptions } from '@/remotes/mutations/auth';

import { LogoutModal } from './logout-modal';
import { MyPageBox } from './my-page-box';
import { WithdrawModal } from './withdraw-modal';

const USER_VOC_LINK = 'https://forms.gle/yV88T98WsADu6VNc6';

const MyPageGeneral = () => {
	const isMutating = useIsMutating({ mutationKey: logoutMutationOptions().mutationKey });

	const { openExternalUrl } = useOpenExternalUrl();

	return (
		<motion.div variants={fadeInOutVariatns.variants}>
			<MyPageBox className="flex flex-col gap-y-2">
				<p className="font-semibold text-body2 text-label-assistive">일반</p>
				<div className="flex flex-col">
					<Pressable
						variant="text"
						className="flex items-center justify-between p-0 py-3 font-medium"
						onClick={() => openExternalUrl(USER_VOC_LINK)}
					>
						<p className="text-body2 text-label-subtle">의견 남기기</p>
						<ChevronRight className="h-6 w-6 text-icon-noraml" />
					</Pressable>
					<LogoutModal>
						<Pressable
							disabled={!!isMutating}
							variant="text"
							className="flex items-center justify-between p-0 py-3 font-medium"
						>
							<p className="text-body2 text-label-subtle">로그아웃</p>
							<ChevronRight className="h-6 w-6 text-icon-noraml" />
						</Pressable>
					</LogoutModal>
					<WithdrawModal>
						<Pressable
							variant="text"
							className="flex items-center justify-between p-0 py-3 font-medium"
						>
							<p className="text-body2 text-label-subtle">탈퇴</p>
							<ChevronRight className="h-6 w-6 text-icon-noraml" />
						</Pressable>
					</WithdrawModal>
				</div>
			</MyPageBox>
		</motion.div>
	);
};

export { MyPageGeneral };
