import { http } from '../http';
import type { CreateUploadRequest, CreateUploadResponse, GetImageUrlResponse } from './types';

export const image = {
	createUpload: (params: CreateUploadRequest) => {
		return http.post<CreateUploadResponse>('v3/images/uploads', { json: params });
	},
	completeUpload: (uploadId: string) => {
		return http.postResponse(`v3/images/uploads/${encodeURIComponent(uploadId)}/complete`, {
			throwHttpErrors: false,
		});
	},
	getImageUrl: (imageId: number) => {
		return http.get<GetImageUrlResponse>(`v3/images/${imageId}`);
	},
};
