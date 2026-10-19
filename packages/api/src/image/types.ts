export interface CreateUploadRequest {
	contentType: 'image/jpeg' | 'image/png';
	size: number;
}

export interface CreateUploadResponse {
	uploadId: string;
	uploadUrl: string;
	expiresAt: string;
}

export interface GetImageUrlResponse {
	url: string;
}
