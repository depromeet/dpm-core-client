'use client';

import { cn } from '@dpm-core/shared';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';
import { CopyIcon } from '../icons/copy';
import { Button, type ButtonProps } from './button';

interface CopyButtonProps extends ButtonProps {
	value: string;
	src?: string;
	onCopy?: () => void;
}

async function copyToClipboardWithMeta(value: string) {
	navigator.clipboard.writeText(value);
}

function CopyButton({
	value,
	className,
	src,
	variant = 'none',
	onCopy,
	...props
}: CopyButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);
	const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

	const handleDebounceCopiedState = () => {
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}
		timeoutIdRef.current = setTimeout(() => {
			setHasCopied(false);
		}, 1000);
	};

	const handleCopy = () => {
		copyToClipboardWithMeta(value);
		setHasCopied(true);
		handleDebounceCopiedState();
		onCopy?.();
	};

	return (
		<Button
			size="none"
			variant={variant}
			className={cn('relative z-10 h-6 w-6 text-icon-noraml hover:text-icon-strong', className)}
			onClick={handleCopy}
			{...props}
		>
			<span className="sr-only">Copy</span>
			{hasCopied ? <CheckIcon /> : <CopyIcon />}
		</Button>
	);
}
export { CopyButton };
