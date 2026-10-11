import type { Member } from '@dpm-core/api';

const MOCK_AUTH_STORAGE_KEY = 'dpm-admin-mock-auth';

export const MOCK_ADMIN_MEMBER: Member = {
	email: 'admin-mock@depromeet.com',
	name: '개발용 운영진',
	cohort: '17',
	part: 'WEB',
	teamNumber: 1,
	isAdmin: true,
	status: 'ACTIVE',
	loginMethod: 'EMAIL',
};

export const isAdminDevMockEnabled = () =>
	process.env.NODE_ENV === 'development' &&
	typeof window !== 'undefined' &&
	window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY) === 'true';

export const enableAdminDevMock = () => {
	window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, 'true');
};

export const disableAdminDevMock = () => {
	window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
};
