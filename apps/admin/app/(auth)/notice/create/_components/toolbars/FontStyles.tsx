'use client';

import { cn } from '@dpm-core/shared';

import type { EditorProps } from './types';

/**
 * @description Bold, Italic, Underline 폰트 스타일 툴
 */
export const FontStyles = ({ editor, handleTooltip }: EditorProps) => {
	return (
		<div className="flex items-center gap-1">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				onMouseOver={(e) => handleTooltip?.(e, 'Bold')}
				onFocus={(e) => handleTooltip?.(e, 'Bold')}
				onMouseOut={() => handleTooltip?.()}
				onBlur={() => handleTooltip?.()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('bold') && 'bg-background-strong',
				)}
				aria-label="Bold"
			>
				<span className="font-bold text-body2 text-icon-noraml">B</span>
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				onMouseOver={(e) => handleTooltip?.(e, 'Italic')}
				onFocus={(e) => handleTooltip?.(e, 'Italic')}
				onMouseOut={() => handleTooltip?.()}
				onBlur={() => handleTooltip?.()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('italic') && 'bg-background-strong',
				)}
				aria-label="Italic"
			>
				<span className="text-body2 italic text-icon-noraml">I</span>
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				disabled={!editor.can().chain().focus().toggleUnderline().run()}
				onMouseOver={(e) => handleTooltip?.(e, 'Underline')}
				onFocus={(e) => handleTooltip?.(e, 'Underline')}
				onMouseOut={() => handleTooltip?.()}
				onBlur={() => handleTooltip?.()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
					editor.isActive('underline') && 'bg-background-strong',
				)}
				aria-label="Underline"
			>
				<span className="text-body2 underline text-icon-noraml">U</span>
			</button>
		</div>
	);
};
