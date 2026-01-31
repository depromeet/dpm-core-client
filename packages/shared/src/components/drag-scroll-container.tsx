'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, type PanInfo } from 'motion/react';

import { cn } from '../utils/cn';

/**
 * 마우스/터치 드래그로 스크롤 가능하게 하는 훅 (관성 효과 포함)
 */
const useDragScroll = () => {
	const ref = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const animationRef = useRef<number | null>(null);

	const animateMomentum = useCallback((velocity: number) => {
		if (!ref.current) return;

		let currentVelocity = velocity;
		const friction = 0.9;
		const minVelocity = 0.3;

		const animate = () => {
			if (!ref.current || Math.abs(currentVelocity) < minVelocity) {
				animationRef.current = null;
				return;
			}

			ref.current.scrollLeft -= currentVelocity;
			currentVelocity *= friction;

			animationRef.current = requestAnimationFrame(animate);
		};

		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}

		animationRef.current = requestAnimationFrame(animate);
	}, []);

	const handlePanStart = useCallback(() => {
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
			animateMomentum(info.velocity.x * 0.1);
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

/**
 * 드래그로 스크롤 가능한 컨테이너 컴포넌트
 * 마우스 드래그, 터치 스와이프, 휠 스크롤 모두 지원
 *
 * @example
 * ```tsx
 * <DragScrollContainer className="px-4 py-2 gap-2">
 *   <Chip label="전체" />
 *   <Chip label="진행 중" />
 * </DragScrollContainer>
 * ```
 */
interface DragScrollContainerProps extends React.ComponentProps<typeof motion.div> {
	children: React.ReactNode;
}

export const DragScrollContainer = ({
	children,
	className,
	...props
}: DragScrollContainerProps) => {
	const { ref, isDragging, panHandlers } = useDragScroll();

	return (
		<motion.div
			ref={ref}
			className={cn(
				'scrollbar-hide flex overflow-x-auto overscroll-x-contain',
				isDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
				className,
			)}
			{...panHandlers}
			{...props}
		>
			{children}
		</motion.div>
	);
};
