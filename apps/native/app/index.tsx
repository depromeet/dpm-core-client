import { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';

const WEBVIEW_URL = __DEV__ ? 'https://core.depromeet.shop' : 'https://core.depromeet.com';

export default function Home() {
	const webViewRef = useRef<WebView>(null);
	const insets = useSafeAreaInsets();
	const [canGoBack, setCanGoBack] = useState(false);

	useEffect(() => {
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
		<View
			style={{
				flex: 1,
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
			}}
		>
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
		</View>
	);
}
