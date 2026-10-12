const FEEDBACK_PATH_PATTERN = /^\/session\/\d+\/feedback\/?$/;

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
	try {
		const url = new URL(path);
		if (
			url.protocol === 'https:' &&
			url.hostname === 'core.depromeet.com' &&
			FEEDBACK_PATH_PATTERN.test(url.pathname)
		) {
			return `/?feedbackUrl=${encodeURIComponent(url.toString())}`;
		}
	} catch {
		return path;
	}

	return path;
}
