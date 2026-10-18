'use client';

import { useRef } from 'react';
import { LoaderCircle, RotateCw } from 'lucide-react';
import { Button, Label, Upload, XIcon } from '@dpm-core/shared';

import { EvidencePreview } from '@/components/attendance';
import type { ImageUploadItem } from '@/hooks/use-image-uploads';

interface AbsenceEvidenceFieldProps {
	items: ImageUploadItem[];
	onAddFiles: (files: File[]) => void;
	onRemove: (id: string) => void;
	onRetry: (id: string) => void;
	disabled: boolean;
}

export function AbsenceEvidenceField({
	items,
	onAddFiles,
	onRemove,
	onRetry,
	disabled,
}: AbsenceEvidenceFieldProps) {
	const input = useRef<HTMLInputElement>(null);

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="absence-evidence">증빙 자료</Label>
			<input
				id="absence-evidence"
				ref={input}
				type="file"
				accept="image/jpeg,image/png"
				multiple
				disabled={disabled}
				className="sr-only"
				onChange={(event) => {
					const files = Array.from(event.target.files ?? []);
					event.target.value = '';
					if (files.length) onAddFiles(files);
				}}
			/>
			<Button
				type="button"
				variant="none"
				size="lg"
				className="w-full justify-start gap-2 border border-line-normal bg-background-normal px-4 font-medium text-body2 text-label-assistive hover:bg-background-subtle"
				disabled={disabled}
				onClick={() => input.current?.click()}
			>
				<Upload />
				이미지 업로드
			</Button>
			<p className="text-caption1 text-label-assistive">PNG, JPG · 최대 10MB</p>
			<ul className="flex flex-wrap items-start gap-2 rounded-lg bg-background-subtle p-3 empty:hidden">
				{items.map((item, index) => (
					<li
						key={item.id}
						className="flex w-fit max-w-full items-center gap-3 rounded-md bg-background-normal px-2 py-1 font-medium text-caption1 text-label-subtle"
					>
						{item.status === 'uploaded' ? (
							<EvidencePreview
								imageId={item.imageId}
								fileName={item.fileName}
								sequence={index + 1}
							/>
						) : (
							<div className="flex min-w-0 items-center gap-1">
								{item.status === 'uploading' ? (
									<LoaderCircle className="size-3.5 shrink-0 animate-spin text-label-assistive" />
								) : (
									<Button
										type="button"
										variant="text"
										size="sm"
										disabled={disabled}
										onClick={() => onRetry(item.id)}
									>
										<RotateCw className="size-3.5" />
									</Button>
								)}
								<span className="line-clamp-2 min-w-0 break-all">{item.fileName}</span>
							</div>
						)}
						<Button
							type="button"
							variant="text"
							size="sm"
							disabled={disabled}
							onClick={() => onRemove(item.id)}
						>
							<XIcon className="size-2.5" />
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}
