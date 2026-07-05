import Cookies from 'js-cookie';

import { COOKIE_KEYS } from '../constants';

export const setCookie = (token: string, expirationTime: number) => {
	Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, token, {
		expires: new Date(Date.now() + expirationTime * 1000),
	});
};
