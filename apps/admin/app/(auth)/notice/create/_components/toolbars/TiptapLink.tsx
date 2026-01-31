'use client';

import { useState } from 'react';
import { Button, cn, Dialog, DialogContent, Input } from '@dpm-core/shared';

import { LinkIcon } from '../icons';
import type { EditorProps } from './types';

/**
 * @description 링크 삽입/편집 툴
 */
export const TiptapLink = ({ editor, handleTooltip }: EditorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [url, setUrl] = useState('');

	const handleOpen = () => {
		const previousUrl = editor.getAttributes('link').href || '';
		setUrl(previousUrl);
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		setUrl('');
	};

	const handleSubmit = () => {
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
		} else {
			editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
		}
		handleClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleOpen}
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
				<LinkIcon className="text-icon-noraml" />
			</button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent
					className="w-[400px] gap-4 p-6"
					showCloseButton={false}
					onInteractOutside={(e) => {
						e.preventDefault();
					}}
				>
					<div className="flex items-center gap-3">
						<Input
							placeholder="URL을 입력하세요"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							onKeyDown={handleKeyDown}
							className="flex-1"
							autoFocus
						/>
						<Button onClick={handleSubmit} size="md">
							완료
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
