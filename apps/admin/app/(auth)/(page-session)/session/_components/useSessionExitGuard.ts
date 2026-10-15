'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const useSessionExitGuard = (isDirty: boolean) => {
	const router = useRouter();
	const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
	const [pendingHref, setPendingHref] = useState<string | null>(null);

	useEffect(() => {
		if (!isDirty) return;

		const handleNavigationClick = (event: MouseEvent) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return;
			}

			const target = event.target;
			if (!(target instanceof Element)) return;

			const link = target.closest<HTMLAnchorElement>('a[href]');
			if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download'))
				return;

			const destination = new URL(link.href, window.location.href);
			if (
				destination.origin !== window.location.origin ||
				destination.href === window.location.href
			)
				return;

			event.preventDefault();
			event.stopPropagation();
			setPendingHref(`${destination.pathname}${destination.search}${destination.hash}`);
			setIsExitConfirmOpen(true);
		};

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue = '';
		};

		document.addEventListener('click', handleNavigationClick, true);
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			document.removeEventListener('click', handleNavigationClick, true);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [isDirty]);

	const handleOpenChange = useCallback((open: boolean) => {
		setIsExitConfirmOpen(open);
		if (!open) setPendingHref(null);
	}, []);

	const confirmExit = useCallback(() => {
		if (!pendingHref) return;

		setIsExitConfirmOpen(false);
		router.push(pendingHref);
		setPendingHref(null);
	}, [pendingHref, router]);

	return {
		isExitConfirmOpen,
		handleOpenChange,
		confirmExit,
	};
};
