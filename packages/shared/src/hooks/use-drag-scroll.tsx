'use client';

import { useCallback, useRef, useState } from 'react';
import type { PanInfo } from 'motion/react';

/**
 * 마우스/터치 드래그로 스크롤 가능하게 하는 훅 (관성 효과 포함)
 *
 * @example
 * ```tsx
 * const { ref, isDragging, panHandlers } = useDragScroll();
 * return (
 *   <div ref={ref} {...panHandlers}>
 *     <div>Scrollable content</div>
 *   </div>
 * );
 * ```
 */
export const useDragScroll = () => {
	const ref = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const animationRef = useRef<number | null>(null);

	// 관성 스크롤 애니메이션
	const animateMomentum = useCallback((velocity: number) => {
		if (!ref.current) return;

		let currentVelocity = velocity;
		const friction = 0.95; // 마찰 계수 (낮을수록 빨리 멈춤)
		const minVelocity = 0.5; // 최소 속도 (이하면 정지)

		const animate = () => {
			if (!ref.current || Math.abs(currentVelocity) < minVelocity) {
				animationRef.current = null;
				return;
			}

			ref.current.scrollLeft -= currentVelocity;
			currentVelocity *= friction;

			animationRef.current = requestAnimationFrame(animate);
		};

		// 이전 애니메이션 취소
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}

		animationRef.current = requestAnimationFrame(animate);
	}, []);

	const handlePanStart = useCallback(() => {
		// 드래그 시작 시 진행 중인 관성 애니메이션 취소
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
		setIsDragging(true);
	}, []);

	const handlePan = useCallback((_: unknown, info: PanInfo) => {
		if (ref.current) {
			ref.current.scrollLeft -= info.delta.x;
		}
	}, []);

	const handlePanEnd = useCallback(
		(_: unknown, info: PanInfo) => {
			setIsDragging(false);
			// 드래그 종료 시 속도 기반 관성 스크롤
			animateMomentum(info.velocity.x * 0.1); // 속도 조절
		},
		[animateMomentum],
	);

	return {
		ref,
		isDragging,
		panHandlers: {
			onPanStart: handlePanStart,
			onPan: handlePan,
			onPanEnd: handlePanEnd,
		},
	};
};
