import type { Editor } from '@tiptap/react';

export interface EditorProps {
	editor: Editor;
	handleTooltip?: (e?: React.MouseEvent | React.FocusEvent, text?: string) => void;
}
