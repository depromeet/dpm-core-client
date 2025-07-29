export interface ApiResponse<T> {
	status: string;
	code: string;
	message: string;
	data: T;
}

export interface ApiErrorReponse {
	code: string;
	message: string;
	status: string;
}
