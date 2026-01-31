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
	// TODO: useHoverTooltip 훅 추가 예정
	const handleTooltip = () => {
		// Tooltip 기능은 다음에 구현
	};

	return (
		<div className="flex h-11 w-full items-center overflow-x-auto bg-background-subtle">
			<div className="flex w-full min-w-fit items-center justify-between gap-2.5 px-5">
				<div className="flex items-center gap-2.5">
					<FontStyles editor={editor} handleTooltip={handleTooltip} />
					<VerticalDivider />
					<TiptapLink editor={editor} handleTooltip={handleTooltip} />
					<VerticalDivider />
					<List editor={editor} handleTooltip={handleTooltip} />
				</div>
				<section className="flex items-center gap-2.5">
					<History editor={editor} handleTooltip={handleTooltip} />
				</section>
			</div>
		</div>
	);
};
