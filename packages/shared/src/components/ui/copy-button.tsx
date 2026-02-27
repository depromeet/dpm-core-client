'use client';

import * as React from 'react';
import { CheckIcon } from 'lucide-react';

import { toast } from '../../components/ui/toast';
import { cn } from '../../utils/cn';
import { CopyIcon } from '../icons/copy';
import { Button, type ButtonProps } from './button';

interface CopyButtonProps extends ButtonProps {
	value: string;
	src?: string;
}

async function copyToClipboardWithMeta(value: string) {
	navigator.clipboard.writeText(value);
}

function CopyButton({ value, className, src, variant = 'none', ...props }: CopyButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);
	const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleDebounceCopiedState = () => {
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}
		timeoutIdRef.current = setTimeout(() => {
			setHasCopied(false);
		}, 1000);
	};

	const handleCopy = () => {
		toast.success('출석 코드를 복사했습니다.');
		copyToClipboardWithMeta(value);
		setHasCopied(true);
		handleDebounceCopiedState();
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
