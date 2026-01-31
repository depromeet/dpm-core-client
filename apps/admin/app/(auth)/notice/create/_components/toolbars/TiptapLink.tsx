'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, cn, Input } from '@dpm-core/shared';

import { LinkIcon } from '../icons';
import type { EditorProps } from './types';

/**
 * @description 링크 삽입/편집 툴
 */
export const TiptapLink = ({ editor, handleTooltip }: EditorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [url, setUrl] = useState('');
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

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
		if (e.key === 'Escape') {
			handleClose();
		}
	};

	// 모달 위치 계산
	useEffect(() => {
		if (!isOpen || !containerRef.current) return;

		const updatePosition = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				setPosition({
					top: rect.bottom + window.scrollY + 8, // 툴바 높이 + 간격
					left: rect.left + window.scrollX,
				});
			}
		};

		updatePosition();
		window.addEventListener('scroll', updatePosition, true);
		window.addEventListener('resize', updatePosition);

		return () => {
			window.removeEventListener('scroll', updatePosition, true);
			window.removeEventListener('resize', updatePosition);
		};
	}, [isOpen]);

	// 외부 클릭 시 닫기
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				containerRef.current &&
				!modalRef.current.contains(event.target as Node) &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setUrl('');
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const modalContent = isOpen && (
		<div
			ref={modalRef}
			className="fixed z-50 w-[400px] rounded-2xl border border-line-normal bg-background-subtle p-4 shadow-lg"
			style={{
				top: `${position.top}px`,
				left: `${position.left}px`,
			}}
		>
			<div className="relative">
				<Input
					placeholder="URL을 입력하세요"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					onKeyDown={handleKeyDown}
					className="border-line-normal bg-background-normal pr-20"
					variant="line"
					autoFocus
				/>
				<Button
					onClick={handleSubmit}
					variant="secondary"
					size="md"
					className="-translate-y-1/2 absolute top-1/2 right-2 h-10 shrink-0"
				>
					완료
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<div ref={containerRef} className="relative">
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
			</div>
			{typeof window !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
		</>
	);
};
