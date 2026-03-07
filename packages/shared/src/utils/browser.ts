export function isMobileFirefox(): boolean | undefined {
	const userAgent = navigator.userAgent;
	return (
		typeof window !== 'undefined' &&
		((/Firefox/.test(userAgent) && /Mobile/.test(userAgent)) || // Android Firefox
			/FxiOS/.test(userAgent)) // iOS Firefox
	);
}

export function isMac(): boolean | undefined {
	return testPlatform(/^Mac/);
}

export function isIPhone(): boolean | undefined {
	return testPlatform(/^iPhone/);
}

export function isSafari(): boolean | undefined {
	return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isIPad(): boolean | undefined {
	return (
		testPlatform(/^iPad/) ||
		// iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
		(isMac() && navigator.maxTouchPoints > 1)
	);
}

export function isIOS(): boolean | undefined {
	return isIPhone() || isIPad();
}

export function testPlatform(re: RegExp): boolean | undefined {
	return typeof window !== 'undefined' && window.navigator != null
		? re.test(window.navigator.platform)
		: undefined;
}

const DPM_APP_UA_REGEX = /DPMApp\/(\d+\.\d+\.\d+)\s*\((\w+)\)/i;

export interface DPMAppInfo {
	isApp: boolean;
	appVersion: string | null;
	platform: 'ios' | 'android' | null;
}

export type AppPlatform = 'ios' | 'android';

export function parseAppPlatform(value: string | null | undefined): AppPlatform | null {
	if (value === 'ios') return 'ios';
	if (value === 'android') return 'android';
	return null;
}

export function parseDPMAppUserAgent(userAgent: string): DPMAppInfo {
	const match = userAgent.match(DPM_APP_UA_REGEX);

	if (!match) {
		return { isApp: false, appVersion: null, platform: null };
	}

	return {
		isApp: true,
		appVersion: match[1],
		platform: parseAppPlatform(match[2].toLowerCase()),
	};
}
