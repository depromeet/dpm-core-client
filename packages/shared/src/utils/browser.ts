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

const DPM_APP_UA_REGEX =
	/DPMApp\/(\d+\.\d+\.\d+)\s*\((\w+)(?:;\s*Insets=(\d+),(\d+),(\d+),(\d+))?\)/i;

export interface SafeAreaInsets {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export const DEFAULT_SAFE_AREA_INSETS: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export interface DPMAppInfo {
	isApp: boolean;
	appVersion: string | null;
	platform: 'ios' | 'android' | null;
	safeAreaInsets: SafeAreaInsets;
}

export type AppPlatform = 'ios' | 'android';

export function parseAppPlatform(value: string | null | undefined): AppPlatform | null {
	if (value === 'ios') return 'ios';
	if (value === 'android') return 'android';
	return null;
}

export function parseSafeAreaInsets(value: string | null | undefined): SafeAreaInsets {
	if (!value) return DEFAULT_SAFE_AREA_INSETS;
	const parts = value.split(',').map(Number);
	if (parts.length !== 4 || parts.some(Number.isNaN)) return DEFAULT_SAFE_AREA_INSETS;
	return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}

export function parseDPMAppUserAgent(userAgent: string): DPMAppInfo {
	const match = userAgent.match(DPM_APP_UA_REGEX);

	if (!match) {
		return {
			isApp: false,
			appVersion: null,
			platform: null,
			safeAreaInsets: DEFAULT_SAFE_AREA_INSETS,
		};
	}

	return {
		isApp: true,
		appVersion: match[1],
		platform: parseAppPlatform(match[2].toLowerCase()),
		safeAreaInsets: match[3]
			? {
					top: Number(match[3]),
					right: Number(match[4]),
					bottom: Number(match[5]),
					left: Number(match[6]),
				}
			: DEFAULT_SAFE_AREA_INSETS,
	};
}
