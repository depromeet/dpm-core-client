export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: 'admin' | 'user';
	createdAt: Date;
	updatedAt: Date;
}

export interface Session {
	id: string;
	title: string;
	description?: string;
	status: 'active' | 'inactive' | 'completed';
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}
