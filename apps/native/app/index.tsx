import { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';

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

	const handleNavigationChnage = (navState: WebViewNavigation) => {
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
				source={{ uri: 'https://core.depromeet.com' }}
				onNavigationStateChange={handleNavigationChnage}
				overScrollMode="never"
				sharedCookiesEnabled={true}
			/>
		</View>
	);
}
