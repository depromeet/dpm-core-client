export interface ApiResponse<T> {
	status: string;
	code: string;
	message: string;
	data: T;
}
