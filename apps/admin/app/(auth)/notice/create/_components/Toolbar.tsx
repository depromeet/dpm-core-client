'use client';

import type { Editor } from '@tiptap/react';
import { cn } from '@dpm-core/shared';

interface ToolbarProps {
	editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
	if (!editor) return null;

	const setLink = () => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL을 입력하세요', previousUrl);

		if (url === null) {
			return;
		}

		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	};

	return (
		<div className="flex items-center gap-2 border-line-normal border-b pb-2">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('bold') && 'bg-background-strong',
				)}
				aria-label="Bold"
			>
				<span className="font-bold text-body2">B</span>
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('italic') && 'bg-background-strong',
				)}
				aria-label="Italic"
			>
				<span className="text-body2 italic">I</span>
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				disabled={!editor.can().chain().focus().toggleUnderline().run()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('underline') && 'bg-background-strong',
				)}
				aria-label="Underline"
			>
				<span className="text-body2 underline">U</span>
			</button>
			<div className="mx-1 h-4 w-px bg-line-normal" />
			<button
				type="button"
				onClick={setLink}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('link') && 'bg-background-strong',
				)}
				aria-label="Link"
			>
				<span className="text-body2">🔗</span>
			</button>
			<div className="mx-1 h-4 w-px bg-line-normal" />
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				disabled={!editor.can().chain().focus().toggleBulletList().run()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('bulletList') && 'bg-background-strong',
				)}
				aria-label="Unordered List"
			>
				<span className="text-body2">•</span>
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				disabled={!editor.can().chain().focus().toggleOrderedList().run()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('orderedList') && 'bg-background-strong',
				)}
				aria-label="Ordered List"
			>
				<span className="text-body2">1.</span>
			</button>
		</div>
	);
};
