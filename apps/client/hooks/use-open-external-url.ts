'use client';

import { toast } from '@dpm-core/shared';

import { useAppConfig } from '@/providers/app-config-provider';
import { useBridgeStatus, useBridgeStore } from '@/providers/bridge-provider';

export const useOpenExternalUrl = () => {
	const { isApp } = useAppConfig();
	const { isWebViewBridgeAvailable, isNativeMethodAvailable } = useBridgeStatus();
	const nativeOpenExternalUrl = useBridgeStore(({ openExternalUrl }) => openExternalUrl);

	const openExternalUrl = async (url: string) => {
		if (!isApp) {
			window.open(url, '_blank', 'noopener,noreferrer');
			return;
		}

		if (!isWebViewBridgeAvailable || !isNativeMethodAvailable('openExternalUrl')) {
			toast.error('링크를 열지 못했어요. 잠시 후 다시 시도해 주세요.');
			return;
		}

		try {
			await nativeOpenExternalUrl(url);
		} catch {
			toast.error('링크를 열지 못했어요. 잠시 후 다시 시도해 주세요.');
		}
	};

	return { openExternalUrl };
};
