import { type RefObject, useEffect } from 'react';
import { FEEDBACK_KEYBOARD_MESSAGE } from '@dpm-core/native/feedback-keyboard-messages';
import type { AppPlatform } from '@dpm-core/shared';

type KeyboardFrame = {
	screenY: number;
	height: number;
	duration: number;
	easing: keyof typeof KEYBOARD_EASING;
	at: number;
};

const KEYBOARD_EASING = {
	easeIn: 'ease-in',
	easeInEaseOut: 'ease-in-out',
	easeOut: 'ease-out',
	linear: 'linear',
	// UIKit's keyboard curve has no CSS timing function equivalent.
	keyboard: 'cubic-bezier(0.18, 0.67, 0.4, 1)',
};

function connectNativeKeyboardLayout(
	content: HTMLElement,
	form: HTMLElement,
	keepFocusedFieldVisible: () => void,
) {
	const nativeWindow = window as Window & {
		dpmFeedbackKeyboardSupported?: boolean;
		ReactNativeWebView?: { postMessage: (message: string) => void };
	};
	const bridge = nativeWindow.ReactNativeWebView;
	if (!nativeWindow.dpmFeedbackKeyboardSupported || !bridge) return;

	let keyboardInset = 0;
	let animation: Animation | undefined;
	const observer = new ResizeObserver(() => {
		if (keyboardInset > 0 && animation?.playState === 'running') keepFocusedFieldVisible();
	});
	observer.observe(content);

	const onFrame = (event: Event) => {
		const { screenY, height, duration, easing, at } = (event as CustomEvent<KeyboardFrame>).detail;
		const fullHeight = window.innerHeight;
		const inset =
			screenY > 0 && screenY + height >= fullHeight - 1 ? Math.max(0, fullHeight - screenY) : 0;
		if (inset === keyboardInset) return;
		keyboardInset = inset;

		const safeArea = getComputedStyle(form).getPropertyValue('--safe-area-inset-bottom').trim();
		const start = {
			height: `${form.getBoundingClientRect().height}px`,
			paddingBottom: getComputedStyle(form).paddingBottom,
		};
		const end = { height: `${fullHeight - inset}px`, paddingBottom: inset > 0 ? '0px' : safeArea };
		animation?.cancel();
		form.style.height = inset > 0 ? end.height : '';
		form.style.paddingBottom = inset > 0 ? end.paddingBottom : '';

		const remaining = Math.max(0, duration - (Date.now() - at));
		if (remaining === 0) {
			if (inset > 0) keepFocusedFieldVisible();
			return;
		}

		animation = form.animate([start, end], {
			duration: remaining,
			easing: KEYBOARD_EASING[easing],
		});
		animation.onfinish = () => {
			if (keyboardInset > 0) keepFocusedFieldVisible();
		};
	};

	window.addEventListener('dpm-feedback-keyboard-frame', onFrame);
	bridge.postMessage(JSON.stringify({ type: FEEDBACK_KEYBOARD_MESSAGE.READY }));
	return () => {
		window.removeEventListener('dpm-feedback-keyboard-frame', onFrame);
		observer.disconnect();
		animation?.cancel();
		form.style.removeProperty('height');
		form.style.removeProperty('padding-bottom');
		bridge.postMessage(JSON.stringify({ type: FEEDBACK_KEYBOARD_MESSAGE.INACTIVE }));
	};
}

export function useFeedbackKeyboardLayout(
	platform: AppPlatform | null,
	contentRef: RefObject<HTMLElement | null>,
	keepFocusedFieldVisible: () => void,
) {
	useEffect(() => {
		const content = contentRef.current;
		const form = content?.parentElement;
		if (!platform || !form || !content) return;

		if (platform === 'ios') {
			const disconnect = connectNativeKeyboardLayout(content, form, keepFocusedFieldVisible);
			if (disconnect) return disconnect;
		}

		let viewportWidth = window.innerWidth;
		let restingHeight = form.clientHeight;
		form.style.setProperty('--feedback-resting-height', `${restingHeight}px`);
		// Resolve the inset against the same viewport height as the form, in the same layout pass.
		form.style.setProperty(
			'padding-bottom',
			'clamp(0px, calc(var(--safe-area-inset-bottom) + 100dvh - var(--feedback-resting-height)), var(--safe-area-inset-bottom))',
		);

		const observer = new ResizeObserver(() => {
			const width = window.innerWidth;
			const height = form.clientHeight;
			if (width !== viewportWidth || height > restingHeight) {
				viewportWidth = width;
				restingHeight = height;
				form.style.setProperty('--feedback-resting-height', `${restingHeight}px`);
			}
		});

		observer.observe(form, { box: 'border-box' });
		return () => {
			observer.disconnect();
			form.style.removeProperty('padding-bottom');
			form.style.removeProperty('--feedback-resting-height');
		};
	}, [platform, contentRef, keepFocusedFieldVisible]);
}
