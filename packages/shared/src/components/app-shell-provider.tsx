'use client';

import React, { type RefObject, useLayoutEffect, useRef, useState } from 'react';

import { useComposedRefs } from '../hooks/use-compose-refs';
import { createContext } from './create-context';

type AppShellContextType = {
	ref: RefObject<HTMLElement | null>;
	container: HTMLElement | null;
	containerWidth: number | null;
};

const AppShellContext = createContext<AppShellContextType>('AppShell', {
	ref: { current: null },
	container: null,
	containerWidth: null,
});
const [AppShellProvider, useAppShell] = AppShellContext;

const AppShell = ({ children }: { children: React.ReactNode }) => {
	const ref = useRef<HTMLElement>(null);
	const [container, setContainer] = useState<HTMLElement | null>(null);
	const [containerWidth, setContainerWidth] = useState<number | null>(null);
	const shellRef = useComposedRefs(ref, setContainer);

	useLayoutEffect(() => {
		if (!container) return;

		const shell = container;
		function updateContainerWidth() {
			setContainerWidth(shell.clientWidth);
		}

		updateContainerWidth();
		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', updateContainerWidth);
			return () => window.removeEventListener('resize', updateContainerWidth);
		}

		const observer = new ResizeObserver(updateContainerWidth);
		observer.observe(shell);
		return () => observer.disconnect();
	}, [container]);

	return (
		<AppShellProvider
			ref={ref}
			container={container}
			containerWidth={container ? containerWidth : null}
		>
			<main
				className="relative mx-auto min-h-dvh max-w-lg bg-white"
				ref={shellRef}
				style={{
					boxShadow: '0px -4px 21.1px 0px #0000001F',
				}}
			>
				{children}
			</main>
		</AppShellProvider>
	);
};

export { AppShell, useAppShell };
