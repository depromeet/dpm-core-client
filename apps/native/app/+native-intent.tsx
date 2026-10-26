const FEEDBACK_PATH_PATTERN = /^\/session\/\d+\/feedback\/?$/;

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
	try {
		const url = new URL(path);
		if (url.protocol === 'https:' && url.hostname === 'core.depromeet.com') {
			if (FEEDBACK_PATH_PATTERN.test(url.pathname)) {
				return `/?feedbackUrl=${encodeURIComponent(url.toString())}`;
			}
			if (url.pathname === '/') return '/';
		}
	} catch {
		return path;
	}

	return path;
}
