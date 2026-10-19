import { queryOptions } from '@tanstack/react-query';
import { image } from '@dpm-core/api';

export const getImageUrlQueryOptions = (imageId: number) => {
	return queryOptions({
		queryKey: ['image-url', imageId],
		queryFn: () => image.getImageUrl(imageId),
		select: (res) => res.data.url,
		staleTime: 0,
		retry: false,
	});
};
