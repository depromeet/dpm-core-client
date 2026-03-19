'use client';

import { useRef, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { type HTMLMotionProps, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { cn, useAppShell, useKeyboardTop } from '@dpm-core/shared';

import { useAppConfig } from '@/providers/app-config-provider';

import { MotionButton } from './motion';

interface CtaButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
	text: string;
	isLoading?: boolean;
	onKeyboardStateChange?: (isKeyboardOpen: boolean) => void;
}

const CtaButton = (props: CtaButtonProps) => {
	const { isApp } = useAppConfig();

	return isApp ? <NativeCtaButton {...props} /> : <WebCtaButton {...props} />;
};

const CtaButtonUI = ({ text, isLoading, ...props }: CtaButtonProps) => {
	const [isButtonPressed, setIsButtonPressed] = useState(false);
	return (
		<MotionButton
			variant="secondary"
			size="full"
			className={cn('rounded-none', props.className)}
			onClick={(event) => {
				if (isLoading) {
					event.preventDefault();
					return;
				}
				props.onClick?.(event);
			}}
			onTapStart={() => setIsButtonPressed(true)}
			onTap={() => setIsButtonPressed(false)}
			onTapCancel={() => setIsButtonPressed(false)}
			{...props}
		>
			{isLoading ? (
				<Loader2Icon className="animate-spin" />
			) : (
				<motion.p animate={{ scale: isButtonPressed ? 0.9 : 1 }}>{text}</motion.p>
			)}
		</MotionButton>
	);
};

function WebCtaButton({ text, isLoading, onKeyboardStateChange, ...props }: CtaButtonProps) {
	const { ref } = useAppShell();

	const buttonRef = useKeyboardTop<HTMLButtonElement>({
		onKeyboardStateChange: onKeyboardStateChange,
	});

	return createPortal(
		<CtaButtonUI
			text={text}
			isLoading={isLoading}
			ref={buttonRef}
			style={{
				...props.style,
				maxWidth: ref.current?.clientWidth,
			}}
			{...props}
		/>,
		ref.current,
	);
}

function NativeCtaButton({ onKeyboardStateChange, ...props }: CtaButtonProps) {
	const { ref } = useAppShell();

	const buttonRef = useRef<HTMLButtonElement>(null);

	return createPortal(
		<CtaButtonUI
			ref={buttonRef}
			style={{
				...props.style,
				maxWidth: ref.current?.clientWidth,
			}}
			{...props}
		/>,
		ref.current,
	);
}

export { CtaButton };
