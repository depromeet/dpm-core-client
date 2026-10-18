'use client';

import type { ReactNode } from 'react';

import { Paperclip, XIcon } from '../icons';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';

interface AttachmentPreviewProps {
	fileName: string | null;
	sequence: number;
	children: (fileName: string) => ReactNode;
}

export function AttachmentPreview({ fileName, sequence, children }: AttachmentPreviewProps) {
	const name = fileName?.trim() || `첨부 이미지 ${sequence}`;
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button type="button" className="flex min-w-0 cursor-pointer items-center gap-1 text-left">
					<Paperclip className="shrink-0 text-label-assistive" />
					<span className="line-clamp-2 min-w-0 break-all">{name}</span>
				</button>
			</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-background-normal p-5"
			>
				<div className="flex items-center justify-between gap-3">
					<DialogTitle className="text-body1">첨부 자료</DialogTitle>
					<DialogClose asChild>
						<Button type="button" variant="text">
							<XIcon className="size-3" />
						</Button>
					</DialogClose>
				</div>
				<DialogDescription className="break-all">{name}</DialogDescription>
				{children(name)}
			</DialogContent>
		</Dialog>
	);
}
