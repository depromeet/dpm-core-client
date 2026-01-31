'use client';

import { cn } from '@dpm-core/shared';

import type { EditorProps } from './types';

/**
 * @description BulletList, OrderedList 툴
 */
export const List = ({ editor, handleTooltip }: EditorProps) => {
	return (
		<div className="flex items-center gap-1">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				disabled={!editor.can().chain().focus().toggleBulletList().run()}
				onMouseOver={(e) => handleTooltip?.(e, 'Bullet List')}
				onFocus={(e) => handleTooltip?.(e, 'Bullet List')}
				onMouseOut={() => handleTooltip?.()}
				onBlur={() => handleTooltip?.()}
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
				onMouseOver={(e) => handleTooltip?.(e, 'Ordered List')}
				onFocus={(e) => handleTooltip?.(e, 'Ordered List')}
				onMouseOut={() => handleTooltip?.()}
				onBlur={() => handleTooltip?.()}
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
