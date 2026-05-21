const kakaoNativeAppKey = process.env.KAKAO_NATIVE_APP_KEY;
const isProductionBuild = process.env.EAS_BUILD_PROFILE === 'production';

if (!kakaoNativeAppKey && isProductionBuild) {
	throw new Error('KAKAO_NATIVE_APP_KEY is required for production builds');
}

if (!kakaoNativeAppKey) {
	console.warn('⚠️ KAKAO_NATIVE_APP_KEY is not set. Kakao login will be disabled.');
}

/** @type {import('expo/config').ExpoConfig} */
const config = {
	name: 'Depromeet',
	slug: 'depromeet-core',
	version: '1.1.0',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	scheme: 'native',
	userInterfaceStyle: 'automatic',
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
		bundleIdentifier: 'com.depromeet.core.app',
		infoPlist: {
			ITSAppUsesNonExemptEncryption: false,
			NSAppTransportSecurity: {
				NSAllowsArbitraryLoads: true,
			},
		},
	},
	android: {
		googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		edgeToEdgeEnabled: true,
		predictiveBackGestureEnabled: false,
		package: 'com.depromeet.core.app',
	},
	web: {
		output: 'static',
		favicon: './assets/images/favicon.png',
	},
	plugins: [
		'expo-router',
		[
			'expo-splash-screen',
			{
				backgroundColor: '#ffffff',
				image: './assets/images/splash-icon-light.png',
				resizeMode: 'contain',
				dark: {
					backgroundColor: '#1F2937',
					image: './assets/images/splash-icon-dark.png',
				},
				imageWidth: 200,
			},
		],
		[
			'expo-build-properties',
			{
				android: {
					usesCleartextTraffic: process.env.APP_ENV !== 'production',
				},
			},
		],
		[
			'expo-notifications',
			{
				icon: './assets/images/icon.png',
				color: '#ffffff',
			},
		],
		// KAKAO_NATIVE_APP_KEY가 주입된 환경에서만 plugin 등록.
		// EAS CLI는 클라우드 시크릿 주입 전에 로컬에서 config를 평가하므로,
		// plugin이 missing 시 throw하면 모든 명령이 막힘. GOOGLE_SERVICES_JSON 패턴 따름.
		kakaoNativeAppKey && [
			'@react-native-kakao/core',
			{
				nativeAppKey: kakaoNativeAppKey,
				android: { authCodeHandlerActivity: true },
				ios: { handleKakaoOpenUrl: true },
			},
		],
	].filter(Boolean),
	experiments: {
		typedRoutes: true,
		reactCompiler: true,
	},
	owner: 'depromeet-core',
	extra: {
		router: {},
		eas: {
			projectId: '036040bf-3e75-4d0e-877c-cb579653f8e8',
		},
		kakaoNativeAppKey,
	},
};

module.exports = { expo: config };
