'use client';

import { useQuery } from '@tanstack/react-query';
import type { ImageResponse } from '@dpm-core/api';
import { AttachmentPreview, ImagePreview } from '@dpm-core/shared';

import { getImageUrlQueryOptions } from '@/remotes/queries';

interface EvidencePreviewProps extends ImageResponse {
	sequence: number;
}
export function EvidencePreview({ imageId, fileName, sequence }: EvidencePreviewProps) {
	return (
		<AttachmentPreview fileName={fileName} sequence={sequence}>
			{(name) => <EvidenceImage imageId={imageId} fileName={name} />}
		</AttachmentPreview>
	);
}
interface EvidenceImageProps {
	imageId: number;
	fileName: string;
}
function EvidenceImage({ imageId, fileName }: EvidenceImageProps) {
	const { data, isFetching, isError, refetch } = useQuery(getImageUrlQueryOptions(imageId));
	return (
		<ImagePreview
			url={data}
			fileName={fileName}
			isLoading={isFetching}
			isError={isError}
			onRetry={() => refetch()}
		/>
	);
}
