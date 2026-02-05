import { bridge } from '@webview-bridge/react-native';
import * as WebBrowser from 'expo-web-browser';

export const appBridge = bridge({
	async getTriggerWeb() {
		return '웹에서 네이티브로 접근!';
	},
	async openInAppBrowser(url: string) {
		return await WebBrowser.openBrowserAsync(url);
	},
});

export type AppBridge = typeof appBridge;
