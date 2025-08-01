import { isServer, QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				// 5분
				staleTime: 1000 * 60 * 5,
				// 10분
				gcTime: 1000 * 60 * 10,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = cache(() => {
	if (isServer) {
		// Server: always make a new query client
		return makeQueryClient();
	} else {
		// Browser: make a new query client if we don't already have one
		// This is very important, so we don't re-make a new client if React
		// suspends during the initial render. This may not be needed if we
		// have a suspense boundary BELOW the creation of the query client
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
});
