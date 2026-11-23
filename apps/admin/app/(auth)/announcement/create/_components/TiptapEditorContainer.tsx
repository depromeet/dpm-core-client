'use client';

import { cn } from '@dpm-core/shared';

import { TiptapEditor, useTiptapEditor } from './TiptapEditor';
import { TiptapEditorSkeleton } from './TiptapEditorSkeleton';
import { Toolbar } from './Toolbar';

interface TiptapEditorContainerProps extends Omit<
	React.ComponentPropsWithoutRef<'div'>,
	'content' | 'onChange'
> {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export const TiptapEditorContainer = ({
	content,
	onChange,
	placeholder = 'ex. 디프만 00기 OT',
	className,
	...props
}: TiptapEditorContainerProps) => {
	const editor = useTiptapEditor({ content, onChange });

	if (!editor) {
		return <TiptapEditorSkeleton />;
	}

	return (
		<div
			className={cn(
				'flex w-full flex-col overflow-hidden rounded-lg border border-line-normal aria-invalid:border-red-400',
				className,
			)}
			{...props}
		>
			<Toolbar editor={editor} />
			<TiptapEditor editor={editor} placeholder={placeholder} />
		</div>
	);
};
