'use client';

import { useMutation } from '@tanstack/react-query';

import { useAppConfig } from '@/providers/app-config-provider';
import { useBridgeStatus, useBridgeStore } from '@/providers/bridge-provider';
import { registerPushTokenMutationOptions } from '@/remotes/mutations/notification';

export function usePushNotification() {
	const { isApp } = useAppConfig();
	const { isWebViewBridgeAvailable, isNativeMethodAvailable } = useBridgeStatus();
	const requestPushPermission = useBridgeStore(
		({ requestPushPermission }) => requestPushPermission,
	);
	const { mutateAsync: registerToken } = useMutation(registerPushTokenMutationOptions());

	const requestAndRegister = async (): Promise<boolean> => {
		if (!isApp || !isWebViewBridgeAvailable || !isNativeMethodAvailable('requestPushPermission'))
			return false;

		try {
			const result = await requestPushPermission();
			if (!result.success) return false;

			await registerToken(result.token);
			return true;
		} catch {
			return false;
		}
	};

	return { requestAndRegister };
}
