import { login as kakaoLoginNative } from '@react-native-kakao/user';
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
	async kakaoLogin() {
		try {
			console.log('[Bridge.kakaoLogin] kakaoLoginNative() 호출');
			const result = await kakaoLoginNative();
			console.log('[Bridge.kakaoLogin] SDK 응답 전체:', JSON.stringify(result, null, 2));
			return {
				success: true as const,
				accessToken: result.accessToken,
				refreshToken: result.refreshToken,
			};
		} catch (error) {
			const code = (error as { code?: string })?.code;
			if (code === 'Cancelled') {
				return { success: false as const, cancelled: true as const };
			}
			return {
				success: false as const,
				cancelled: false as const,
				error: '카카오 로그인에 실패했습니다.',
			};
		}
	},
});

export type AppBridge = typeof appBridge;
