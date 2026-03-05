'use client';

import type { Editor } from '@tiptap/react';

import { FontStyles, History, List, TiptapLink, VerticalDivider } from './toolbars';

interface ToolbarProps {
	editor: Editor;
}

/**
 * @description Tiptap 에디터 툴바
 */
export const Toolbar = ({ editor }: ToolbarProps) => {
	return (
		<div className="relative flex h-11 w-full items-center overflow-x-auto bg-background-subtle">
			<div className="flex w-full min-w-fit items-center justify-between gap-2.5 px-5">
				<div className="flex items-center gap-2.5">
					<FontStyles editor={editor} />
					<VerticalDivider />
					<TiptapLink editor={editor} />
					<VerticalDivider />
					<List editor={editor} />
				</div>
				<section className="flex items-center gap-2.5">
					<History editor={editor} />
				</section>
			</div>
		</div>
	);
};
