import { queryOptions } from '@tanstack/react-query';
import { image } from '@dpm-core/api';

export const getImageUrlQueryOptions = (imageId: number) =>
	queryOptions({
		queryKey: ['IMAGE', imageId, 'preview-url'],
		queryFn: () => image.getImageUrl(imageId),
		select: (res) => res.data.url,
		staleTime: 0,
		retry: false,
		refetchOnWindowFocus: false,
	});
