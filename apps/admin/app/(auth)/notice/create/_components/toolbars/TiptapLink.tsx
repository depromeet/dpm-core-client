'use client';

import { cn } from '@dpm-core/shared';

import type { EditorProps } from './types';

/**
 * @description 링크 삽입/편집 툴
 */
export const TiptapLink = ({ editor, handleTooltip }: EditorProps) => {
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
		<button
			type="button"
			onClick={setLink}
			onMouseOver={(e) => handleTooltip?.(e, 'Link')}
			onFocus={(e) => handleTooltip?.(e, 'Link')}
			onMouseOut={() => handleTooltip?.()}
			onBlur={() => handleTooltip?.()}
			className={cn(
				'flex h-8 w-8 items-center justify-center rounded hover:bg-background-strong',
				editor.isActive('link') && 'bg-background-strong',
			)}
			aria-label="Link"
		>
			<span className="text-body2 text-icon-noraml">🔗</span>
		</button>
	);
};
