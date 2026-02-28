'use client';

import { cn } from '@dpm-core/shared';

import { RedoIcon, UndoIcon } from '../icons';
import type { EditorProps } from './types';

/**
 * @description Undo/Redo 히스토리 툴
 */
export const History = ({ editor }: EditorProps) => {
	return (
		<div className="flex items-center gap-1">
			<button
				type="button"
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong disabled:opacity-40',
				)}
				aria-label="Undo"
			>
				<UndoIcon className="text-icon-noraml" />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong disabled:opacity-40',
				)}
				aria-label="Redo"
			>
				<RedoIcon className="text-icon-noraml" />
			</button>
		</div>
	);
};
