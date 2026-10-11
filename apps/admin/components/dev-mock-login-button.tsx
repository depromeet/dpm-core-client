'use client';

import { enableAdminDevMock } from '@/lib/dev-mock-auth';

export const DevMockLoginButton = () => {
	if (process.env.NODE_ENV !== 'development') return null;

	return (
		<button
			type="button"
			className="cursor-pointer rounded-lg border border-line-subtle px-4 py-2 font-medium text-body2 text-label-subtle hover:bg-background-subtle"
			onClick={() => {
				enableAdminDevMock();
				window.location.assign('/');
			}}
		>
			개발용 Mock 로그인
		</button>
	);
};
