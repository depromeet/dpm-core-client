'use client';

import { useEffect, useRef } from 'react';

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

function isInput(target: Element) {
	return (
		(target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
		target instanceof HTMLTextAreaElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	);
}

function isMobileFirefox(): boolean | undefined {
	const userAgent = navigator.userAgent;
	return (
		typeof window !== 'undefined' &&
		((/Firefox/.test(userAgent) && /Mobile/.test(userAgent)) || // Android Firefox
			/FxiOS/.test(userAgent)) // iOS Firefox
	);
}

const WINDOW_TOP_OFFSET = 26;

const useKeyboardTop = <T extends HTMLElement>() => {
	const keyboardIsOpen = useRef(false);
	const previousDiffFromInitial = useRef(0);
	const ref = useRef<T>(null);
	const initialDrawerHeight = useRef(0);

	useEffect(() => {
		function onVisualViewportChange() {
			if (!ref.current) return;

			const focusedElement = document.activeElement as HTMLElement;
			if (isInput(focusedElement) || keyboardIsOpen.current) {
				const visualViewportHeight = window.visualViewport?.height || 0;
				const totalHeight = window.innerHeight;
				// This is the height of the keyboard
				const diffFromInitial = totalHeight - visualViewportHeight;
				const drawerHeight = ref.current.getBoundingClientRect().height || 0;
				// Adjust drawer height only if it's tall enough
				const isTallEnough = drawerHeight > totalHeight * 0.8;

				if (!initialDrawerHeight.current) {
					initialDrawerHeight.current = drawerHeight;
				}
				const offsetFromTop = ref.current.getBoundingClientRect().top;

				// visualViewport height may change due to somq e subtle changes to the keyboard. Checking if the height changed by 60 or more will make sure that they keyboard really changed its open state.
				if (Math.abs(previousDiffFromInitial.current - diffFromInitial) > 60) {
					keyboardIsOpen.current = !keyboardIsOpen.current;
				}

				// if (snapPoints && snapPoints.length > 0 && snapPointsOffset && activeSnapPointIndex) {
				// 	const activeSnapPointHeight = snapPointsOffset[activeSnapPointIndex] || 0;
				// 	diffFromInitial += activeSnapPointHeight;
				// }
				previousDiffFromInitial.current = diffFromInitial;
				// We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can correctly check if the input is in view
				if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
					const height = ref.current.getBoundingClientRect().height;
					let newDrawerHeight = height;

					if (height > visualViewportHeight) {
						newDrawerHeight =
							visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
					}

					ref.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
				} else if (!isMobileFirefox()) {
					ref.current.style.height = `${initialDrawerHeight.current}px`;
				}
				if (!keyboardIsOpen.current) {
					ref.current.style.bottom = `0px`;
					document.body.style.overflow = '';
				} else {
					// Negative bottom value would never make sense
					ref.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
					document.body.style.overflow = 'hidden';
				}
			}
		}

		window.visualViewport?.addEventListener('resize', onVisualViewportChange);
		return () => window.visualViewport?.removeEventListener('resize', onVisualViewportChange);
	}, []);

	return ref;
};

export { useKeyboardTop };
