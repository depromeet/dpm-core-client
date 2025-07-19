'use client';

import React, { type RefObject, useRef } from 'react';
import { createContext } from '@/providers/create-context';

type AppShellContextType = {
	ref: RefObject<HTMLElement>;
};

const AppShellContext = createContext<AppShellContextType>('AppShell', {
	ref: { current: null as unknown as HTMLElement },
});
const [AppShellProvider, useAppShell] = AppShellContext;

const AppShell = ({ children }: { children: React.ReactNode }) => {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<AppShellProvider ref={ref as RefObject<HTMLElement>}>
			<main className="max-w-lg mx-auto min-h-dvh relative" ref={ref}>
				{children}
			</main>
		</AppShellProvider>
	);
};

export { AppShell, useAppShell };
