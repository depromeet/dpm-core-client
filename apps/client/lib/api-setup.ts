import { COOKIE_KEYS, http } from '@dpm-core/api';

http.setTokenProvider(async () => {
	if (typeof window === 'undefined') {
		const { cookies } = await import('next/headers');
		const cookieStore = await cookies();
		return cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
	}
	return http.getDefaultToken();
});
