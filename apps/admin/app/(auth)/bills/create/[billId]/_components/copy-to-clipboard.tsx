'use client';

import { cloneElement, isValidElement, type MouseEventHandler, type ReactElement } from 'react';

interface CopyToClipboardProps {
	text: string;
	children: ReactElement<{ onClick?: MouseEventHandler }>;
	onCopy?: () => void;
}

const copyToClipboard = async (text: string) => {
	navigator.clipboard.writeText(text);
};

export const CopyToClipBoard = ({ text, children, onCopy }: CopyToClipboardProps) => {
	const handleCopyClipBoard = async () => {
		await copyToClipboard(text);
		onCopy?.();
	};

	if (!isValidElement(children)) {
		console.warn(
			'CopyToClipboard 컴포넌트에는 유효한 React 엘리먼트만 children으로 전달할 수 있습니다.',
		);
		return null;
	}

	return cloneElement(children, {
		onClick: handleCopyClipBoard,
	});
};
