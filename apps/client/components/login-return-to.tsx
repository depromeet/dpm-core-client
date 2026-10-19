'use client';

import { useEffect } from 'react';

import { getSafeFeedbackReturnTo, LOGIN_RETURN_TO_KEY } from '@/lib/login-return-to';

interface LoginReturnToProps {
	returnTo?: string;
	preserveExisting?: boolean;
}

export const LoginReturnTo = ({ returnTo, preserveExisting = false }: LoginReturnToProps) => {
	useEffect(() => {
		const safeReturnTo = getSafeFeedbackReturnTo(returnTo);
		if (safeReturnTo) {
			window.sessionStorage.setItem(LOGIN_RETURN_TO_KEY, safeReturnTo);
		} else if (!preserveExisting) {
			window.sessionStorage.removeItem(LOGIN_RETURN_TO_KEY);
		}
	}, [returnTo, preserveExisting]);

	return null;
};
