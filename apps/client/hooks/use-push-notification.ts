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
	const { mutate: registerToken } = useMutation(registerPushTokenMutationOptions());

	const requestAndRegister = async () => {
		if (!isApp || !isWebViewBridgeAvailable || !isNativeMethodAvailable('requestPushPermission'))
			return;

		const result = await requestPushPermission();

		if (result.success) {
			registerToken(result.token);
		}
	};

	return { requestAndRegister };
}
