import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';

const WEBVIEW_URL = __DEV__ ? 'https://core.depromeet.shop' : 'https://core.depromeet.com';

export default function Home() {
	const webViewRef = useRef<WebView>(null);
	const [canGoBack, setCanGoBack] = useState(false);

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
			<SafeAreaView style={{ flex: 1 }}>
				<WebView
					style={{
						flex: 1,
					}}
					ref={webViewRef}
					source={{ uri: WEBVIEW_URL }}
					onNavigationStateChange={handleNavigationChanage}
					overScrollMode="never"
					sharedCookiesEnabled={true}
					allowsBackForwardNavigationGestures={true}
				/>
				<StatusBar style="dark" />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
