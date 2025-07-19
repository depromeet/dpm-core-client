export interface BaseResponse<T> {
	status: string;
	code: string;
	message: string;
	data: T;
}
