import { type NextRequest, NextResponse } from 'next/server';

const DPM_APP_UA_REGEX =
	/DPMApp\/(\d+\.\d+\.\d+)\s*\((\w+)(?:;\s*Insets=(\d+),(\d+),(\d+),(\d+))?\)/i;

interface AppHeaders {
	isApp: string;
	version: string;
	platform: string;
	safeAreaInsets: string;
}

function parseAppHeaders(request: NextRequest): AppHeaders | null {
	const userAgent = request.headers.get('user-agent') ?? '';
	const match = userAgent.match(DPM_APP_UA_REGEX);

	if (match) {
		const insets = match[3] ? `${match[3]},${match[4]},${match[5]},${match[6]}` : '0,0,0,0';
		return {
			isApp: 'true',
			version: match[1],
			platform: match[2].toLowerCase(),
			safeAreaInsets: insets,
		};
	}

	if (request.cookies.get('dpm_isApp')?.value === 'true') {
		return {
			isApp: 'true',
			version: request.cookies.get('dpm_appVersion')?.value ?? '',
			platform: request.cookies.get('dpm_platform')?.value ?? '',
			safeAreaInsets: request.cookies.get('dpm_safeAreaInsets')?.value ?? '0,0,0,0',
		};
	}

	return null;
}

function setAppHeaders(headers: Headers, app: AppHeaders) {
	headers.set('x-app-is-app', app.isApp);
	headers.set('x-app-version', app.version);
	headers.set('x-app-platform', app.platform);
	headers.set('x-app-safe-area-insets', app.safeAreaInsets);
}

export function middleware(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);

	requestHeaders.set('x-pathname', request.nextUrl.pathname);

	const appHeaders = parseAppHeaders(request);
	if (appHeaders) {
		setAppHeaders(requestHeaders, appHeaders);
	}

	return NextResponse.next({
		request: { headers: requestHeaders },
	});
}
