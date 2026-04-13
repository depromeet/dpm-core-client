export interface RegisterPushTokenRequest {
	token: string;
}

export interface RegisterPushTokenResponse {
	id: number;
	memberId: number;
	token: string;
	createdAt: string;
	updatedAt: string;
}
