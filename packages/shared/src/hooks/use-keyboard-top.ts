'use client';

import { isInput, isMobileFirefox, usePreventScroll } from '@dpm-core/shared';
import { useEffect, useRef, useState } from 'react';

const nonTextInputTypes = new Set([
	'checkbox',
	'radio',
	'range',
	'color',
	'file',
	'image',
	'button',
	'submit',
	'reset',
]);

const WINDOW_TOP_OFFSET = 26;

interface UseKeyboardTopOptions {
	onKeyboardOpen?: () => void;
	onKeyboardClose?: () => void;
}

const useKeyboardTop = <T extends HTMLElement>(options?: UseKeyboardTopOptions) => {
	const ref = useRef<T>(null);
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
	usePreventScroll({ isDisabled: !isKeyboardOpen });
	const { onKeyboardOpen, onKeyboardClose } = options || {};

	useEffect(() => {
		let keyboardIsOpen = false;
		let previousDiffFromInitial = 0;
		let initialDrawerHeight = 0;

		function onVisualViewportChange() {
			if (!ref.current) return;

			const focusedElement = document.activeElement as HTMLElement;
			if (isInput(focusedElement) || keyboardIsOpen) {
				const visualViewportHeight = window.visualViewport?.height || 0;
				const totalHeight = window.innerHeight;
				// This is the height of the keyboard
				const diffFromInitial = totalHeight - visualViewportHeight;
				const drawerHeight = ref.current.getBoundingClientRect().height || 0;
				// Adjust drawer height only if it's tall enough
				const isTallEnough = drawerHeight > totalHeight * 0.8;

				if (!initialDrawerHeight) {
					initialDrawerHeight = drawerHeight;
				}
				const offsetFromTop = ref.current.getBoundingClientRect().top;

				// visualViewport height may change due to somq e subtle changes to the keyboard. Checking if the height changed by 60 or more will make sure that they keyboard really changed its open state.
				if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) {
					keyboardIsOpen = !keyboardIsOpen;
				}

				// if (snapPoints && snapPoints.length > 0 && snapPointsOffset && activeSnapPointIndex) {
				// 	const activeSnapPointHeight = snapPointsOffset[activeSnapPointIndex] || 0;
				// 	diffFromInitial += activeSnapPointHeight;
				// }
				previousDiffFromInitial = diffFromInitial;
				// We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can correctly check if the input is in view
				if (drawerHeight > visualViewportHeight || keyboardIsOpen) {
					const height = ref.current.getBoundingClientRect().height;
					let newDrawerHeight = height;

					if (height > visualViewportHeight) {
						newDrawerHeight =
							visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
					}

					ref.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
				} else if (!isMobileFirefox()) {
					ref.current.style.height = `${initialDrawerHeight}px`;
				}
				if (!keyboardIsOpen) {
					ref.current.style.bottom = `0px`;
					document.body.style.overflow = '';
					ref.current.style.transition = '';
					ref.current.style.transitionDelay = '';
					setIsKeyboardOpen(false);
					onKeyboardClose?.();
				} else {
					// Negative bottom value would never make sense
					ref.current.style.transition = 'bottom 0.3s ease-in-out';
					ref.current.style.transitionDelay = '0.3s';

					ref.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
					// transition timing is 0.3s + 0.3s
					// 하단 전환이 완료된 후 스크롤 비활성화
					onKeyboardOpen?.();
					setTimeout(() => {
						setIsKeyboardOpen(true);
					}, 300 + 300);
				}
			}
		}

		window.visualViewport?.addEventListener('resize', onVisualViewportChange);
		return () => window.visualViewport?.removeEventListener('resize', onVisualViewportChange);
	}, [onKeyboardOpen, onKeyboardClose]);

	return ref;
};

export { useKeyboardTop };
