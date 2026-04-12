import * as Notifications from 'expo-notifications';
import { SplashScreen, Stack } from 'expo-router';

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

// 토큰 확인용 (테스트 후 제거)
Notifications.getExpoPushTokenAsync({
	projectId: '036040bf-3e75-4d0e-877c-cb579653f8e8',
}).then(({ data }) => console.log('📱 Expo Push Token:', data));

export default function RootLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
		</Stack>
	);
}
