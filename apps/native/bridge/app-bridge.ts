import { bridge } from '@webview-bridge/react-native';
import * as WebBrowser from 'expo-web-browser';

import { requestPushNotificationPermission } from '@/lib/push-notification-permission';

export const appBridge = bridge({
	async getTriggerWeb() {
		return '웹에서 네이티브로 접근!';
	},
	async openInAppBrowser(url: string) {
		return await WebBrowser.openBrowserAsync(url);
	},
	async requestPushPermission() {
		try {
			const token = await requestPushNotificationPermission();
			return { success: true as const, token };
		} catch (error) {
			const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
			return { success: false as const, error: message };
		}
	},
});

export type AppBridge = typeof appBridge;
