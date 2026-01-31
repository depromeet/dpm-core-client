'use client';

import type { Editor } from '@tiptap/react';

import { FontStyles, History, List, TiptapLink, VerticalDivider } from './toolbars';

interface ToolbarProps {
	editor: Editor | null;
}

/**
 * @description Tiptap 에디터 툴바
 */
export const Toolbar = ({ editor }: ToolbarProps) => {
	if (!editor) return null;

	// TODO: useHoverTooltip 훅 추가 예정
	const handleTooltip = () => {
		// Tooltip 기능은 다음에 구현
	};

	return (
		<div className="w-full overflow-x-auto border-line-normal border-b">
			<div className="flex min-w-fit items-center gap-2.5 p-5">
				<History editor={editor} handleTooltip={handleTooltip} />
				<VerticalDivider />
				<FontStyles editor={editor} handleTooltip={handleTooltip} />
				<VerticalDivider />
				<TiptapLink editor={editor} handleTooltip={handleTooltip} />
				<VerticalDivider />
				<List editor={editor} handleTooltip={handleTooltip} />
			</div>
		</div>
	);
};
