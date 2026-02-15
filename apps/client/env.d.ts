declare namespace NodeJS {
	interface ProcessEnv {
		// Stage
		NEXT_PUBLIC_STAGE?: 'development' | 'production';

		// Apple OAuth
		NEXT_PUBLIC_APPLE_CLIENT_ID?: string;
		NEXT_PUBLIC_APPLE_REDIRECT_URI?: string;
		NEXT_PUBLIC_APPLE_REDIRECT_URI_DEV?: string;
	}
}
