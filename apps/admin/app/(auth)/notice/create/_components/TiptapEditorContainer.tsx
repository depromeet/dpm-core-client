'use client';

import { useEffect, useState } from 'react';

import { TiptapEditor, useTiptapEditor } from './TiptapEditor';
import { TiptapEditorSkeleton } from './TiptapEditorSkeleton';
import { Toolbar } from './Toolbar';

interface TiptapEditorContainerProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export const TiptapEditorContainer = ({ content, onChange }: TiptapEditorContainerProps) => {
	const [isMounted, setIsMounted] = useState(false);
	const editor = useTiptapEditor({ content, onChange });

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted || !editor) {
		return <TiptapEditorSkeleton />;
	}

	return (
		<div className="flex w-full flex-col overflow-hidden rounded-lg border border-line-normal">
			<Toolbar editor={editor} />
			<TiptapEditor editor={editor} />
		</div>
	);
};
