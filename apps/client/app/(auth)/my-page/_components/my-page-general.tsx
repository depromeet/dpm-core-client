'use client';

import { useIsMutating } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ChevronRight, fadeInOutVariatns, toast } from '@dpm-core/shared';

import { Pressable } from '@/components/motion';
import { useAppConfig } from '@/providers/app-config-provider';
import { useBridgeStatus, useBridgeStore } from '@/providers/bridge-provider';
import { logoutMutationOptions } from '@/remotes/mutations/auth';

import { LogoutModal } from './logout-modal';
import { MyPageBox } from './my-page-box';
import { WithdrawModal } from './withdraw-modal';

const USER_VOC_LINK = 'https://forms.gle/yV88T98WsADu6VNc6';

const MyPageGeneral = () => {
	const isMutating = useIsMutating({ mutationKey: logoutMutationOptions().mutationKey });

	const { isApp } = useAppConfig();
	const { isWebViewBridgeAvailable, isNativeMethodAvailable } = useBridgeStatus();
	const openInAppBrowser = useBridgeStore(({ openInAppBrowser }) => openInAppBrowser);

	const canUseNativeBrowser =
		isApp && isWebViewBridgeAvailable && isNativeMethodAvailable('openInAppBrowser');

	const handleOpenVoc = async () => {
		if (canUseNativeBrowser) {
			try {
				await openInAppBrowser(USER_VOC_LINK);
			} catch {
				toast.error('의견 남기기 페이지를 열지 못했어요. 다시 시도해 주세요.');
			}
			return;
		}

		window.open(USER_VOC_LINK, '_blank', 'noopener,noreferrer');
	};

	return (
		<motion.div variants={fadeInOutVariatns.variants}>
			<MyPageBox className="flex flex-col gap-y-2">
				<p className="font-semibold text-body2 text-label-assistive">일반</p>
				<div className="flex flex-col">
					<Pressable
						variant="text"
						className="flex items-center justify-between p-0 py-3 font-medium"
						onClick={handleOpenVoc}
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
