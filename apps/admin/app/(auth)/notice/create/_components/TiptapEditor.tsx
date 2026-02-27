'use client';

import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import { cn } from '@dpm-core/shared';

import { tiptapExtensions } from '../_configs/tiptap-extensions';

interface TiptapEditorProps {
	editor: Editor | null;
	className?: string;
	placeholder?: string;
}

export const TiptapEditor = ({ editor, className, placeholder }: TiptapEditorProps) => {
	const [isEmpty, setIsEmpty] = useState(true);

	useEffect(() => {
		if (!editor) return;
		const updateEmpty = () => setIsEmpty(editor.isEmpty);
		updateEmpty();
		editor.on('update', updateEmpty);
		return () => {
			editor.off('update', updateEmpty);
		};
	}, [editor]);

	if (!editor) return null;

	return (
		<div className="relative w-full">
			<EditorContent editor={editor} className={cn('w-full focus:outline-none', className)} />
			{placeholder && isEmpty && (
				<div
					className="pointer-events-none absolute top-0 left-0 p-4 font-medium text-body2 text-label-assistive"
					aria-hidden
				>
					{placeholder}
				</div>
			)}
		</div>
	);
};

interface UseTiptapEditorProps {
	content: string;
	onChange: (content: string) => void;
}

export const useTiptapEditor = ({ content, onChange }: UseTiptapEditorProps) => {
	const editor = useEditor({
		extensions: tiptapExtensions,
		content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					'h-[300px] w-full p-4 font-medium text-body2 outline-none transition-color placeholder:text-label-assistive bg-background-normal resize-none overflow-y-auto',
				style: 'line-height: 1.6;',
			},
		},
	});

	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	return editor;
};
