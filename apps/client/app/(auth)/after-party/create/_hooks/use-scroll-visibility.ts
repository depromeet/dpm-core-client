'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'motion/react';

interface UseScrollVisibilityOptions {
	/** 스크롤 멈춤 후 표시까지의 지연 시간 (ms) */
	delay?: number;
	/** 초기 표시 상태 */
	initialVisible?: boolean;
}

/**
 * 스크롤 중에는 숨기고, 스크롤 멈추면 표시하는 훅
 * @returns { isVisible } - 현재 표시 상태
 */
export const useScrollVisibility = (options: UseScrollVisibilityOptions = {}) => {
	const { delay = 300, initialVisible = true } = options;

	const [isVisible, setIsVisible] = useState(initialVisible);
	const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const isVisibleRef = useRef(initialVisible);
	const { scrollY } = useScroll();

	useEffect(() => {
		const unsubscribe = scrollY.on('change', () => {
			// 이미 숨겨진 상태면 상태 업데이트 스킵 (리렌더링 방지)
			if (isVisibleRef.current) {
				isVisibleRef.current = false;
				setIsVisible(false);
			}

			// 이전 타이머 취소
			clearTimeout(scrollTimerRef.current);

			// 스크롤 멈추면 지정된 시간 후 표시
			scrollTimerRef.current = setTimeout(() => {
				isVisibleRef.current = true;
				setIsVisible(true);
			}, delay);
		});

		return () => {
			unsubscribe();
			clearTimeout(scrollTimerRef.current);
		};
	}, [scrollY, delay]);

	return { isVisible };
};
