'use client';

import { useRef, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { type HTMLMotionProps, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { cn, isWebView, useAppShell, useKeyboardTop } from '@dpm-core/shared';

import { MotionButton } from './motion';

interface CtaButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
	text: string;
	isLoading?: boolean;
	onKeyboardStateChange?: (isKeyboardOpen: boolean) => void;
}

function useKeyboardTopSafe<T extends HTMLElement>(options?: {
	onKeyboardStateChange?: (isKeyboardOpen: boolean) => void;
}) {
	const fallbackRef = useRef<T>(null);
	const keyboardRef = useKeyboardTop<T>(options);

	if (isWebView()) {
		return fallbackRef;
	}
	return keyboardRef;
}

const CtaButton = ({ text, isLoading, onKeyboardStateChange, ...props }: CtaButtonProps) => {
	const [isButtonPressed, setIsButtonPressed] = useState(false);
	const { ref } = useAppShell();
	const buttonRef = useKeyboardTopSafe<HTMLButtonElement>({
		onKeyboardStateChange,
	});

	return createPortal(
		<MotionButton
			variant="secondary"
			size="full"
			{...props}
			style={{
				...props.style,
				maxWidth: ref.current.clientWidth,
			}}
			className={cn('rounded-none', props.className)}
			onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
				if (isLoading) {
					event.preventDefault();
					return;
				}
				props.onClick?.(event);
			}}
			onTapStart={() => setIsButtonPressed(true)}
			onTap={() => setIsButtonPressed(false)}
			onTapCancel={() => setIsButtonPressed(false)}
			ref={buttonRef}
		>
			{isLoading ? (
				<Loader2Icon className="animate-spin" />
			) : (
				<motion.p animate={{ scale: isButtonPressed ? 0.9 : 1 }}>{text}</motion.p>
			)}
		</MotionButton>,
		ref.current,
	);
};

export { CtaButton };
