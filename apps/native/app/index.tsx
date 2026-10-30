import { useCallback, useEffect, useRef, useState } from 'react';
import { createWebView } from '@webview-bridge/react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { SplashScreen, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WebView as NativeWebView, WebViewNavigation } from 'react-native-webview';

import { appBridge } from '@/bridge/app-bridge';
import { useBehavior } from '@/hooks/useBehavior';
import { getNotificationPath } from '@/lib/notification-route';

export const { WebView } = createWebView({
	bridge: appBridge,
	debug: __DEV__,
});

const WEBVIEW_URL = process.env.EXPO_PUBLIC_WEBVIEW_URL ?? 'https://dev.depromeet.com';
const FEEDBACK_PATH_PATTERN = /^\/session\/\d+\/feedback\/?$/;

const getFeedbackLink = (value: string | string[] | undefined) => {
	if (typeof value !== 'string') return undefined;

	try {
		const url = new URL(value);
		if (url.origin === 'https://core.depromeet.com' && FEEDBACK_PATH_PATTERN.test(url.pathname)) {
			return url.toString();
		}
	} catch {
		return undefined;
	}

	return undefined;
};

function WebViewContainer() {
	const { feedbackUrl } = useLocalSearchParams<{ feedbackUrl?: string | string[] }>();
	const [initialFeedbackUrl] = useState(() => getFeedbackLink(feedbackUrl));
	const webViewRef = useRef<NativeWebView>(null);
	const [canGoBack, setCanGoBack] = useState(false);
	const behavior = useBehavior();
	const insets = useSafeAreaInsets();

	const [appIsReady, setAppIsReady] = useState(false);
	const appIsReadyRef = useRef(false);
	const [webViewUrl, setWebViewUrl] = useState(initialFeedbackUrl ?? WEBVIEW_URL);
	const [isFeedbackRoute, setIsFeedbackRoute] = useState(() => {
		try {
			return FEEDBACK_PATH_PATTERN.test(new URL(initialFeedbackUrl ?? WEBVIEW_URL).pathname);
		} catch {
			return false;
		}
	});

	useEffect(() => {
		const nextFeedbackUrl = getFeedbackLink(feedbackUrl);
		if (nextFeedbackUrl) setWebViewUrl(nextFeedbackUrl);
	}, [feedbackUrl]);

	// 알림 탭 → 앱이 꺼져 있던 경우(콜드 스타트)와 켜져 있던 경우 모두 마지막 응답으로 들어온다.
	const lastNotificationResponse = Notifications.useLastNotificationResponse();
	const handledNotificationIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (!lastNotificationResponse) return;
		if (lastNotificationResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
			return;
		}

		const { identifier, content } = lastNotificationResponse.notification.request;
		if (handledNotificationIdRef.current === identifier) return;
		handledNotificationIdRef.current = identifier;

		const path = getNotificationPath(content.data);
		if (!path) return;

		const url = new URL(path, WEBVIEW_URL).toString();
		if (appIsReadyRef.current) {
			webViewRef.current?.injectJavaScript(`window.location.assign(${JSON.stringify(url)});true;`);
		} else {
			setWebViewUrl(url);
		}
	}, [lastNotificationResponse]);

	const hideSplashScreen = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	useEffect(() => {
		hideSplashScreen();
	}, [hideSplashScreen]);

	const handleWebViewLoadEnd = () => {
		appIsReadyRef.current = true;
		setAppIsReady(true);
	};

	useEffect(() => {
		if (Platform.OS !== 'android') return;
		const onBackPress = () => {
			if (canGoBack && webViewRef.current) {
				webViewRef.current.goBack();
				return true;
			}
			return false;
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
		return () => backHandler.remove();
	}, [canGoBack]);

	const handleNavigationChanage = (navState: WebViewNavigation) => {
		setCanGoBack(navState.canGoBack);
		try {
			setIsFeedbackRoute(FEEDBACK_PATH_PATTERN.test(new URL(navState.url).pathname));
		} catch {
			setIsFeedbackRoute(false);
		}
	};

	const platformStr = Platform.OS === 'ios' ? 'iOS' : 'Android';
	const version = Constants.expoConfig?.version ?? '1.0.0';
	const insetsStr = `${Math.round(insets.top)},${Math.round(insets.right)},${Math.round(insets.bottom)},${Math.round(insets.left)}`;
	// Keep iOS keyboard avoidance active before the keyboard opens on feedback screens.
	const keyboardBehavior = Platform.OS === 'ios' && isFeedbackRoute ? 'padding' : behavior;

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView behavior={keyboardBehavior} style={styles.container}>
				<WebView
					style={styles.webview}
					ref={webViewRef}
					source={{ uri: webViewUrl }}
					applicationNameForUserAgent={`DPMApp/${version} (${platformStr}; Insets=${insetsStr})`}
					onNavigationStateChange={handleNavigationChanage}
					onLoadEnd={handleWebViewLoadEnd}
					overScrollMode="never"
					bounces={false}
					sharedCookiesEnabled={true}
					allowsBackForwardNavigationGestures={true}
					webviewDebuggingEnabled={__DEV__ || process.env.EXPO_PUBLIC_WEBVIEW_DEBUG === 'true'}
				/>
				<StatusBar style="dark" />
			</KeyboardAvoidingView>
		</View>
	);
}

export default function Home() {
	return (
		<SafeAreaProvider>
			<WebViewContainer />
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	webview: { flex: 1 },
});
