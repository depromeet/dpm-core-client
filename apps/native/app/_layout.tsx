import { initializeKakaoSDK } from '@react-native-kakao/core';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { SplashScreen, Stack } from 'expo-router';

const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey as string | undefined;

if (kakaoNativeAppKey) {
	console.log('[KakaoSDK] Initializing with key:', `${kakaoNativeAppKey.slice(0, 6)}...`);
	initializeKakaoSDK(kakaoNativeAppKey);
} else {
	console.warn('[KakaoSDK] NATIVE_APP_KEY missing in Constants.expoConfig.extra');
}

// 앱이 포그라운드일 때 수신된 알림 표시 방식 설정
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
		</Stack>
	);
}
