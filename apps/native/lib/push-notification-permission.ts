import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestPushNotificationPermission(): Promise<string> {
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (!Device.isDevice) {
		throw new Error('푸시 알람은 물리적 기기에서만 테스트 가능합니다.');
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		throw new Error('푸시 알람 권한이 없습니다.');
	}

	const projectId =
		Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
	if (!projectId) {
		throw new Error('EAS Project ID가 설정되지 않았습니다.');
	}

	const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
	return token;
}
