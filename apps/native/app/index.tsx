import { useCallback, useEffect, useRef, useState } from 'react';
import { createWebView } from '@webview-bridge/react-native';
import Constants from 'expo-constants';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { WebView as NativeWebView, WebViewNavigation } from 'react-native-webview';

import { appBridge } from '@/bridge/app-bridge';
import { useBehavior } from '@/hooks/useBehavior';

export const { WebView } = createWebView({
	bridge: appBridge,
	debug: __DEV__,
});

const WEBVIEW_URL = __DEV__ ? 'https://core.depromeet.shop' : 'https://core.depromeet.com';

export default function Home() {
	const webViewRef = useRef<NativeWebView>(null);
	const [canGoBack, setCanGoBack] = useState(false);
	const behavior = useBehavior();

	const [appIsReady, setAppIsReady] = useState(false);

	const hideSplashScreen = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	useEffect(() => {
		hideSplashScreen();
	}, [hideSplashScreen]);

	const handleWebViewLoadEnd = () => {
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
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<KeyboardAvoidingView behavior={behavior} style={styles.container}>
					<WebView
						style={styles.webview}
						ref={webViewRef}
						source={{ uri: WEBVIEW_URL }}
						applicationNameForUserAgent={`DPMApp/${Constants.expoConfig?.version ?? '1.0.0'} (${Platform.OS === 'ios' ? 'iOS' : 'Android'})`}
						onNavigationStateChange={handleNavigationChanage}
						onLoadEnd={handleWebViewLoadEnd}
						overScrollMode="never"
						bounces={false}
						sharedCookiesEnabled={true}
						allowsBackForwardNavigationGestures={true}
					/>
					<StatusBar style="dark" />
				</KeyboardAvoidingView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	webview: { flex: 1 },
});
