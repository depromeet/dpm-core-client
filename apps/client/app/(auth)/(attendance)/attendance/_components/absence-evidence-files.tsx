'use client';

import type { ImageResponse } from '@dpm-core/api';

import { EvidencePreview } from '@/components/attendance';

interface AbsenceEvidenceFilesProps {
	images: ImageResponse[];
}

export function AbsenceEvidenceFiles({ images }: AbsenceEvidenceFilesProps) {
	if (!images.length) return null;

	return (
		<ul className="flex flex-wrap items-start gap-2">
			{images.map(({ imageId, fileName }, index) => (
				<li
					key={imageId}
					className="flex w-fit max-w-full items-center rounded-md bg-background-normal px-2 py-1 font-medium text-caption1 text-label-subtle"
				>
					<EvidencePreview imageId={imageId} fileName={fileName} sequence={index + 1} />
				</li>
			))}
		</ul>
	);
}
