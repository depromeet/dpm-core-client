import { initializeKakaoSDK } from '@react-native-kakao/core';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { SplashScreen, Stack } from 'expo-router';

const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey as string | undefined;

if (kakaoNativeAppKey) {
	initializeKakaoSDK(kakaoNativeAppKey);
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
