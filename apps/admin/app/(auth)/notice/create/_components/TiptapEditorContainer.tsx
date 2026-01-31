'use client';

import { TiptapEditor, useTiptapEditor } from './TiptapEditor';
import { Toolbar } from './Toolbar';

interface TiptapEditorContainerProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export const TiptapEditorContainer = ({ content, onChange }: TiptapEditorContainerProps) => {
	const editor = useTiptapEditor({ content, onChange });

	if (!editor) return null;

	return (
		<div className="flex w-full flex-col">
			<Toolbar editor={editor} />
			<TiptapEditor editor={editor} />
		</div>
	);
};
