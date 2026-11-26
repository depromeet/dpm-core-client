import { type RefObject, useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { WebView as NativeWebView, WebViewMessageEvent } from 'react-native-webview';

import { FEEDBACK_KEYBOARD_MESSAGE } from '@/bridge/feedback-keyboard-messages';

import { useBehavior } from './useBehavior';

const ENABLE_FEEDBACK_KEYBOARD_BRIDGE = 'window.dpmFeedbackKeyboardSupported = true; true;';

export function useFeedbackKeyboardBridge(
	webViewRef: RefObject<NativeWebView | null>,
	isIOSFeedback: boolean,
) {
	const [feedbackKeyboardReady, setFeedbackKeyboardReady] = useState(false);
	const behavior = useBehavior();
	const webManagesFeedbackKeyboard = isIOSFeedback && feedbackKeyboardReady;

	useEffect(() => {
		if (!webManagesFeedbackKeyboard) return;

		const sendFrame = (screenY: number, height: number, duration: number, easing: string) => {
			const frame = JSON.stringify({ screenY, height, duration, easing, at: Date.now() });
			webViewRef.current?.injectJavaScript(
				`window.dispatchEvent(new CustomEvent('dpm-feedback-keyboard-frame', { detail: ${frame} })); true;`,
			);
		};
		const currentKeyboard = Keyboard.metrics();
		if (currentKeyboard) sendFrame(currentKeyboard.screenY, currentKeyboard.height, 0, 'linear');

		const subscription = Keyboard.addListener('keyboardWillChangeFrame', (event) => {
			const { screenY, height } = event.endCoordinates;
			sendFrame(screenY, height, event.duration, event.easing);
		});
		return () => subscription.remove();
	}, [webManagesFeedbackKeyboard, webViewRef]);

	const handleFeedbackKeyboardMessage = ({ nativeEvent }: WebViewMessageEvent) => {
		if (Platform.OS !== 'ios') return;

		try {
			const message: unknown = JSON.parse(nativeEvent.data);
			if (typeof message !== 'object' || message === null || !('type' in message)) return;

			if (message.type === FEEDBACK_KEYBOARD_MESSAGE.READY) setFeedbackKeyboardReady(true);
			if (message.type === FEEDBACK_KEYBOARD_MESSAGE.INACTIVE) setFeedbackKeyboardReady(false);
		} catch {
			// Ignore messages that are not JSON.
		}
	};

	return {
		keyboardAvoidanceEnabled: !webManagesFeedbackKeyboard,
		// Keep iOS keyboard avoidance active before the keyboard opens on feedback screens.
		keyboardBehavior: isIOSFeedback ? ('padding' as const) : behavior,
		handleFeedbackKeyboardMessage,
		resetFeedbackKeyboard: () => setFeedbackKeyboardReady(false),
		bridgeScript: Platform.OS === 'ios' ? ENABLE_FEEDBACK_KEYBOARD_BRIDGE : undefined,
	};
}
