'use client';

import { cn } from '@dpm-core/shared';

import { BoldIcon, ItalicIcon, UnderlineIcon } from '../icons';
import type { EditorProps } from './types';

/**
 * @description Bold, Italic, Underline 폰트 스타일 툴
 */
export const FontStyles = ({ editor }: EditorProps) => {
	return (
		<div className="flex items-center gap-1">
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
				<BoldIcon className="text-icon-noraml" />
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
				<ItalicIcon className="text-icon-noraml" />
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
				<UnderlineIcon className="text-icon-noraml" />
			</button>
		</div>
	);
};
