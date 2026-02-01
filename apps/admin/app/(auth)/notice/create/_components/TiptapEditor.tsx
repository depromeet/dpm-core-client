'use client';

import { useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import { cn } from '@dpm-core/shared';

import { tiptapExtensions } from '../_configs/tiptap-extensions';

interface TiptapEditorProps {
	editor: Editor | null;
	className?: string;
}

export const TiptapEditor = ({ editor, className }: TiptapEditorProps) => {
	if (!editor) return null;

	return (
		<div className="w-full">
			<EditorContent editor={editor} className={cn('w-full focus:outline-none', className)} />
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
					'min-h-[300px] w-full p-4 font-medium text-body2 outline-none transition-color placeholder:text-label-assistive bg-background-normal resize-none',
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
