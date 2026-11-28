'use client';

import type { MouseEvent } from 'react';

import { useOpenExternalUrl } from '@/hooks/use-open-external-url';
import { useAppConfig } from '@/providers/app-config-provider';

export const useExternalLinkClick = () => {
	const { isApp } = useAppConfig();
	const { openExternalUrl } = useOpenExternalUrl();

	return (event: MouseEvent<HTMLElement>) => {
		const isModifiedClick =
			event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
		if (!isApp || event.defaultPrevented || isModifiedClick) return;
		if (!(event.target instanceof Element)) return;

		const link = event.target.closest('a[href]');
		if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download')) return;

		let url: URL;
		try {
			url = new URL(link.href);
		} catch {
			return;
		}

		const isExternalHttpLink =
			(url.protocol === 'https:' || url.protocol === 'http:') &&
			url.origin !== window.location.origin;
		if (!isExternalHttpLink) return;

		event.preventDefault();
		openExternalUrl(url.href);
	};
};
