'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 5분
			staleTime: 1000 * 60 * 5,
			// 10분
			gcTime: 1000 * 60 * 10,
		},
	},
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
