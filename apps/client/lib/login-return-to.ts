export const LOGIN_RETURN_TO_KEY = 'dpm-login-return-to';
const SESSION_FEEDBACK_PATH = /^\/session\/\d+\/feedback(?:[?#]|$)/;

export const getSafeReturnTo = (value: string | null | undefined) => {
	if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
		return undefined;
	}

	try {
		const url = new URL(value, 'https://dpm-core.local');
		if (url.origin !== 'https://dpm-core.local') return undefined;

		return `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return undefined;
	}
};

export const getSafeFeedbackReturnTo = (value: string | null | undefined) => {
	const returnTo = getSafeReturnTo(value);
	return returnTo && SESSION_FEEDBACK_PATH.test(returnTo) ? returnTo : undefined;
};

export const consumeLoginReturnTo = () => {
	const returnTo = getSafeFeedbackReturnTo(window.sessionStorage.getItem(LOGIN_RETURN_TO_KEY));
	window.sessionStorage.removeItem(LOGIN_RETURN_TO_KEY);
	return returnTo;
};
